import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import createRegisterStyles from "../styles/register-styles";
import {LinearGradient} from "expo-linear-gradient";
import {useFontSize} from "../utils/utils";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { fontSize, setFontSize } = useFontSize();

    const styles = createRegisterStyles(fontSize);

    const handleRegister = () => {
        // add firebase register logic in future
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

                <LinearGradient
                    colors={['#F8DDF4', 'transparent']}
                    style={styles.background}
                    >

                    <View style={styles.textButtonContainer}>
                        <TouchableOpacity onPress={decreaseFontSize} style={styles.resizeTextButton}>
                            <Text style={styles.buttonTextResize}>A-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={increaseFontSize} style={styles.resizeTextButton}>
                            <Text style={styles.buttonTextResize}>A+</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Регистрация</Text>
                </LinearGradient>

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
                <TextInput
                    style={styles.input}
                    placeholder="повторите пароль"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={'black'}
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>создать аккаунт</Text>
                </TouchableOpacity>

                <Text style={styles.linkText}>Есть аккаунт?</Text>
                <TouchableOpacity onPress={handleRegister} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Войти</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
