import React, {useRef, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from "expo-linear-gradient";
import { useFontSize } from "../utils/utils";
import createMainStyles from "../styles/main-styles";
import { Dropdown } from "react-native-element-dropdown";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function Main({ navigation }) {
    const [mode, setMode] = useState('0');
    const [contrast, setContrast] = useState('2.00');
    const { fontSize, setFontSize } = useFontSize();

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
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
            // Создаем путь для временного хранения аудиофайла
            const fileUri = FileSystem.cacheDirectory + 'temp_sound.wav';

            // Преобразуем Base64 в аудиофайл и сохраняем
            await FileSystem.writeAsStringAsync(fileUri, base64Sound, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Загружаем звук и воспроизводим его
            const { sound } = await Audio.Sound.createAsync(
                { uri: fileUri },
                { shouldPlay: true }
            );

            // Звук будет воспроизводиться автоматически из-за `shouldPlay: true`
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    // Освобождаем ресурсы после завершения воспроизведения
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };


    async function callSonificateImage(imageBase64, mode, contrast) {
        try {
            const response = await fetch('https://7a88-5-2-55-78.ngrok-free.app/remake', {
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
        let isProcessing = false;

        intervalRef.current = setInterval(async () => {
            if (cameraRef.current && !isProcessing) {
                isProcessing = true;  // Устанавливаем флаг, чтобы заблокировать последующие вызовы
                try {
                    console.log('');

                    // Захват фото
                    const photo = await cameraRef.current.takePictureAsync({
                        quality: 0.8,
                        base64: true,
                        skipProcessing: false,
                    });

                    console.log(mode, contrast);

                    let data = await callSonificateImage(photo.base64, mode, contrast);

                    await playBase64Sound(data.audio);
                    setCapturedImage(data.image);
                } catch (error) {
                    console.error('Error taking picture:', error);
                } finally {
                    isProcessing = false; // Сбрасываем флаг после завершения операции
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
