import React, {useEffect, useRef, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from "expo-linear-gradient";
import { useFontSize } from "../utils/utils";
import createMainStyles from "../styles/main-styles";
import { Dropdown } from "react-native-element-dropdown";

export default function Main({ navigation }) {
    const [mode, setMode] = useState('');
    const [contrast, setContrast] = useState('');
    const { fontSize, setFontSize } = useFontSize();

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const cameraRef = useRef(null);
    const intervalRef = useRef(null);

    const styles = createMainStyles(fontSize);

    // setMode('first');
    // setContrast(2);

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

    const turnOnCamera = () => {
        setIsCameraActive(true);
    };

    const turnOffCamera = () => {
        setIsCameraActive(false);
    };

    const startCapturing = () => {
        setIsCameraActive(true);
        intervalRef.current = setInterval(async () => {
            if (cameraRef.current) {
                try {
                    console.log('');

                    const photo = await cameraRef.current.takePictureAsync({
                        quality: 0.8,
                        base64: false,
                        skipProcessing: false,
                    });
                    setCapturedImage(photo.uri);
                    console.log(mode);
                } catch (error) {
                    console.error('Error taking picture:', error);
                }
            }
        }, 5000);
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

    // useEffect(() => {
    //     return () => {
    //         // Очищаем интервал при размонтировании компонента
    //         if (intervalRef.current) {
    //             clearInterval(intervalRef.current);
    //         }
    //     };
    // }, []);

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

                {isCameraActive && (
                    <CameraView ref={cameraRef} mute={true} style={styles.cameraFill} facing={facing} onCameraReady={() => console.log('Camera is ready')}>
                        <Image source={{ uri: capturedImage }} style={styles.cameraFill} />
                    </CameraView>
                )}
                {!isCameraActive && (
                    <View style={styles.cameraFill}>
                        <Text style={styles.cameraFillText}>Нет изображения с камеры</Text>
                    </View>
                )}
            </LinearGradient>

            <Text style={styles.pointName}>Выберите режим</Text>
            <Dropdown
                style={styles.input}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.placeholder}
                inputSearchStyle={styles.placeholder}
                data={[
                    { label: 'Режим 1', value: 'first' },
                    { label: 'Режим 2', value: 'second' },
                    { label: 'Режим 3', value: 'third' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Режим 1"
                value={mode}
                onChange={item => setMode(item.value)}
            />

            <Text style={styles.pointName}>Выберите контраст</Text>
            <TextInput
                style={styles.input}
                placeholder="1.05"
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
