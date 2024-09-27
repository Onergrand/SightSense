import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';

import authStyles from "../styles/authStyles";

const styles = authStyles;

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <ImageBackground
                    source={require('../../assets/images/background-fill.png')}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.textButtonContainer}>
                        <TouchableOpacity id="decrease-font-size"  style={styles.resizeTextButton}>
                            <Text style={styles.buttonTextResize}>A-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity id="increase-font-size"  style={styles.resizeTextButton}>
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
