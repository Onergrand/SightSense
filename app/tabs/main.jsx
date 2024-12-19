import React, {useRef, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from "expo-linear-gradient";
import { useFontSize } from "../utils/utils";
import createMainStyles from "../styles/main-styles";
import { Dropdown } from "react-native-element-dropdown";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {NativeModules} from "react-native-web";

const { NewLib } = NativeModules;

const processImage = async (imageBase64, mode, contrast) => {
    try {
        const imageArray = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
        const N = 176;
        const M = 64;

        // Преобразуем base64 в изображение
        const grayFrame = imageArray.slice(0, N * M).reduce((acc, value, idx) => {
            const row = Math.floor(idx / N);
            if (!acc[row]) acc[row] = [];
            acc[row].push(value);
            return acc;
        }, []);

        const firstImage = grayFrame.map(row => row.slice(0, N / 2));
        const secondImage = grayFrame.map(row => row.slice(N / 2));

        if (mode === 0) {
            const meanFrame = firstImage.map((row, i) => row.map((val, j) => (val + secondImage[i][j]) / 2));
            const processedFrame = meanFrame.map(row => row.map(val => Math.min(255, val + contrast * (val - 128))));
            await NewLib.stereo(processedFrame.flat());
            return processedFrame;
        } else if (mode === 1) {
            const processedFirst = firstImage.map(row => row.map(val => Math.min(255, val + contrast * (val - 128))));
            const processedSecond = secondImage.map(row => row.map(val => Math.min(255, val + contrast * (val - 128))));
            await NewLib.binaural(processedFirst.flat(), processedSecond.flat());
            return { first: processedFirst, second: processedSecond };
        } else if (mode === 2) {
            const newLeft = Array.from({ length: M }, () => Array(13).fill(0));
            const newRight = Array.from({ length: M }, () => Array(13).fill(0));

            for (let i = 0; i < M; i++) {
                newLeft[i][0] = firstImage[i][0];
                newRight[i][0] = secondImage[i][0];
                let fs = 1;
                let step = 2;
                for (let j = 1; j < 13; j++) {
                    newLeft[i][j] = firstImage[i].slice(fs, fs + step).reduce((a, b) => a + b, 0) / step;
                    newRight[i][j] = secondImage[i].slice(fs, fs + step).reduce((a, b) => a + b, 0) / step;
                    fs += step;
                    step++;
                }
            }
            const processedLeft = newLeft.map(row => row.map(val => Math.min(255, val + contrast * (val - 128))));
            const processedRight = newRight.map(row => row.map(val => Math.min(255, val + contrast * (val - 128))));
            await NewLib.binaural(processedLeft.flat(), processedRight.flat());
            return { left: processedLeft, right: processedRight };
        } else {
            throw new Error('Invalid mode');
        }
    } catch (error) {
        console.error('Error in processing image:', error);
        throw error;
    }
};

export default function Main({ navigation }) {
    const [mode, setMode] = useState('0');
    const [contrast, setContrast] = useState('2.00');
    const { fontSize, setFontSize } = useFontSize();

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);z
    const cameraRef = useRef(null);
    const intervalRef = useRef(null);

    const styles = createMainStyles(fontSize);


    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const playBase64Sound = async (base64Sound) => {
        try {
            const sound = new Audio.Sound();
            const soundUri = `data:audio/wav;base64,${base64Sound}`;
            await sound.loadAsync({ uri: soundUri });
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };


    const startCapturing = () => {
        setIsCameraActive(true);
        intervalRef.current = setInterval(async () => {
            if (cameraRef.current) {
                try {
                    const photo = await cameraRef.current.takePictureAsync({ base64: true });
                    setCapturedImage(photo.base64);

                    const processedImage = await processImage(photo.base64, parseInt(mode), parseFloat(contrast));
                    console.log('Processed Image:', processedImage);

                    const processedBase64 = btoa(String.fromCharCode(...processedImage.flat()));
                    await playBase64Sound(processedBase64);
                } catch (error) {
                    console.error('Error capturing or processing image:', error);
                }
            }
        }, 1000);
    };


    const stopCapturing = () => {
        setIsCameraActive(false);
        clearInterval(intervalRef.current);
    };

    const decreaseFontSize = () => {
        setFontSize(prevFontSize => ({
            title: Math.max(prevFontSize.title - 2, 8),
            main: Math.max(prevFontSize.main - 2, 8),
            button: Math.max(prevFontSize.button - 2, 8),
            buttonResize: Math.max(prevFontSize.buttonResize - 2, 8),
        }));
    };

    const increaseFontSize = () => {
        setFontSize(prevFontSize => ({
            title: prevFontSize.title + 2,
            main: prevFontSize.main + 2,
            button: prevFontSize.button + 2,
            buttonResize: prevFontSize.buttonResize + 2,
        }));
    };


    return (
        <View style={styles.container}>
            <LinearGradient colors={['#F8DDF4', 'transparent']} style={styles.background}>
                <View style={styles.topMenuContainer}>
                    <View style={styles.textButtonContainer}>
                        <TouchableOpacity onPress={decreaseFontSize} style={styles.resizeTextButton}>
                            <Text style={styles.buttonTextResize}>A-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={increaseFontSize} style={styles.resizeTextButton}>
                            <Text style={styles.buttonTextResize}>A+</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {isCameraActive && (<Image source={{ uri: `data:image/jpeg;base64,<${capturedImage}>` }} style={styles.cameraFill} />)}
                {isCameraActive && (
                    <CameraView ref={cameraRef} mute={true} style={styles.camera} facing={facing} onCameraReady={() => console.log('Camera is ready')}>
                    </CameraView>
                )}
                {!isCameraActive && (
                    <View style={styles.cameraFill}>
                        <Text style={styles.cameraFillText}>Нет изображения с камеры</Text>
                    </View>
                )}
            </LinearGradient>

            <Text style={styles.pointName}>Выберите камеру</Text>
            <Dropdown
                style={styles.input}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.placeholder}
                inputSearchStyle={styles.placeholder}
                data={[
                    { label: 'Основная', value: 'back' },
                    { label: 'Фронтальная', value: 'front' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Основная камера"
                value={facing}
                onChange={item => setFacing(item.value)}
            />

            <Text style={styles.pointName}>Выберите режим</Text>
            <Dropdown
                style={styles.input}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.placeholder}
                inputSearchStyle={styles.placeholder}
                data={[
                    { label: 'Режим 1', value: '0' },
                    { label: 'Режим 2', value: '1' },
                    { label: 'Режим 3', value: '2' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Режим ..."
                value={mode}
                onChange={item => setMode(item.value)}
            />

            <Text style={styles.pointName}>Выберите контраст</Text>
            <TextInput
                style={styles.input}
                placeholder="2.00"
                keyboardType="numeric"
                value={contrast}
                onChangeText={setContrast}
                placeholderTextColor={'black'}
            />

            <View style={styles.cameraActions}>
                <TouchableOpacity onPress={stopCapturing} style={styles.cameraActionButton}>
                    <Text style={styles.cameraActionButtonText}>стоп</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={startCapturing} style={styles.cameraActionButton}>
                    <Text style={styles.cameraActionButtonText}>старт</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.bottomMenuButton}>
                    <Image source={require('../../assets/images/home-icon.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.bottomMenuButton}>
                    <Image source={require('../../assets/images/profile-icon.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
