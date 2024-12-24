import React, {useEffect, useRef, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-element-dropdown';
import {useFontSize} from "../utils/utils";
import createMainStyles from "../styles/main-styles";
import { PermissionsAndroid, Platform } from 'react-native';

export default function Main({ navigation }) {
    const [mode, setMode] = useState('0');
    const [contrast, setContrast] = useState('2.00');
    const { fontSize, setFontSize } = useFontSize();

    const [facing, setFacing] = useState('back');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const cameraRef = useRef(null);
    const intervalRef = useRef(null);

    const styles = createMainStyles(fontSize);


    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Camera Permission",
                        message: "This app needs access to your camera to take pictures.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            return true;
        }
    };

    useEffect(() => {
        (async () => {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
                console.error('Camera permission denied');
            }
        })();
    }, []);

    const playBase64Sound = async (base64Sound) => {
        try {
            const fileUri = `${RNFS.CachesDirectoryPath}/temp_sound.wav`;

            await RNFS.writeFile(fileUri, base64Sound, 'base64');

            const sound = new Sound(fileUri, Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.error('Ошибка загрузки звука:', error);
                    return;
                }

                sound.play((success) => {
                    sound.release();
                });
            });
        } catch (error) {
            console.error('Ошибка при воспроизведении звука:', error);
        }
    };


    async function callSonificateImage(imageBase64, mode, contrast) {
        try {
            const response = await fetch('https://sonificationserver-production.up.railway.app/remake', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_base64: imageBase64, mode: mode, contrast: contrast }),
            });

            if (!response.ok) {
                console.error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    const startCapturing = () => {
        setIsCameraActive(true);
        setIsBlocked(true);
        isCancelledRef.current = false;
        let isProcessing = false;

        intervalRef.current = setInterval(async () => {
            if (cameraRef.current && !isProcessing) {
                isProcessing = true;  // Устанавливаем флаг, чтобы заблокировать последующие вызовы
                try {
                    console.log('');

                    // Захват фото
                    const photo = await cameraRef.current.takePictureAsync({
                        quality: 0.3,
                        base64: true,
                        skipProcessing: false,
                    });

                    console.log(mode, contrast);

                    let data = await callSonificateImage(photo.base64, mode, contrast);

                    await playBase64Sound(data.audio);
                    setCapturedImage(data.image);
                } finally {
                    isProcessing = false; // Сбрасываем флаг после завершения операции
                }
            }
        }, 1000);
    };

    const stopCapturing = () => {
        if (isCameraActive) {
            setIsCameraActive(false);

            clearInterval(intervalRef.current);

            setCapturedImage(null);

            if (cameraRef.current?.pausePreview) {
                console.log("Останавливаю предварительный просмотр...");
                cameraRef.current.pausePreview();
            }
        }
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

    useEffect(() => {
        return () => clearInterval(intervalRef.current); // Очищаем интервал при размонтировании
    }, []);

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

                {isCameraActive && capturedImage ? (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
                        style={styles.cameraFill}
                    />
                ) : (
                    <View style={styles.cameraFill}>
                        <Text style={styles.cameraFillText}>Нет изображения с камеры</Text>
                    </View>
                )}

                {isCameraActive && (
                    <RNCamera
                        ref={cameraRef}
                        style={{
                            height: 1,
                            width: 1,
                            opacity: 0
                        }}
                        type={facing === 'back' ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                        captureAudio={false}
                        onCameraReady={() => console.log('Camera is ready')}
                        onMountError={error => console.error('Camera mount error:', error)}
                    />
                )}
            </LinearGradient>

            <Text style={styles.pointName}>Выберите камеру</Text>
            <Dropdown
                style={styles.input}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.placeholder}
                inputSearchStyle={styles.placeholder}
                itemTextStyle={{color: "#000"}}
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
                itemTextStyle={{color: "#000"}}
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
                <TouchableOpacity
                    onPress={stopCapturing}
                    style={styles.cameraActionButton}>
                    <Text style={styles.cameraActionButtonText}>стоп</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={startCapturing}
                    style={styles.cameraActionButton}>
                    <Text style={styles.cameraActionButtonText}>старт</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.bottomMenuButton} aria-valuetext={"Главная"}>
                    <Image source={require('../../assets/images/home-icon.png')} style={styles.icon}
                           alt={"Главная"}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    style={styles.bottomMenuButton} aria-valuetext={"Профиль"}>
                    <Image source={require('../../assets/images/profile-icon.png')} style={styles.icon}
                           alt={"Профиль"}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
