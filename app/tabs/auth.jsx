import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';

import createAuthStyles from "../styles/authStyles";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fontSize, setFontSize] = useState({
        title: 48,
        button: 18,
        main: 24,
        buttonResize: 36,
    });

    const styles = createAuthStyles(fontSize);

    const [fontsLoaded] = useFonts({
        MontserratRegular: require('../../assets/fonts/Montserrat-Regular.ttf'),
        MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
        MontserratBold: require('../../assets/fonts/Montserrat-Bold.ttf'),
        MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleLogin = () => {
        // add firebase login logic in future
        console.log(username, password);
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
            <View style={styles.overlay}>
                <ImageBackground
                    source={require('../../assets/images/background-fill.png')}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.textButtonContainer}>
                        <TouchableOpacity onPress={decreaseFontSize} style={styles.resizeTextButton}>
                            <Text style={styles.buttonTextResize}>A-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={increaseFontSize} style={styles.resizeTextButton}>
                            <Text style={styles.buttonTextResize}>A+</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Добро пожаловать!</Text>
                </ImageBackground>
                <TextInput
                    style={styles.input}
                    placeholder="введите логин"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor={'black'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="введите пароль"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={'black'}
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>вход</Text>
                </TouchableOpacity>

                <Text style={styles.linkText}>Нет аккаунта?</Text>
                <TouchableOpacity onPress={handleLogin} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
