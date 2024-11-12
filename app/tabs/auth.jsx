import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import createAuthStyles from "../styles/auth-styles";
import {useFontSize} from "../utils/utils";
import {LinearGradient} from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import {FIREBASE_AUTH} from "../firebaseConfig";

export default function Login({ navigation }) {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const { fontSize, setFontSize } = useFontSize();
    const auth = FIREBASE_AUTH;

    const styles = createAuthStyles(fontSize);

    const handleLogin = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, mail, password);
            navigation.navigate('Main');
        } catch (error) {
            alert('Ошибка', error.message);
        }
    }

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

                    <Text style={styles.title}>Добро пожаловать!</Text>
                </LinearGradient>

                <TextInput
                    style={styles.input}
                    placeholder="введите почту"
                    textContentType={"emailAddress"}
                    value={mail}
                    onChangeText={setMail}
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
                <TouchableOpacity onPress={() => handleLogin()} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>вход</Text>
                </TouchableOpacity>

                <Text style={styles.linkText}>Нет аккаунта?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
