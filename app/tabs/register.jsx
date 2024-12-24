import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';

import createRegisterStyles from "../styles/register-styles";
import {LinearGradient} from "react-native-linear-gradient";
import {useFontSize} from "../utils/utils";
import { createUserWithEmailAndPassword } from "firebase/auth";

import {FIREBASE_AUTH} from "../firebaseConfig";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Register({ navigation }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const { fontSize, setFontSize } = useFontSize();
    const auth = FIREBASE_AUTH;

    const styles = createRegisterStyles(fontSize);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают.');
            return;
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate('RegisterData');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Ошибка', 'Этот email уже зарегистрирован.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Ошибка', 'Неверный формат электронной почты.');
            } else if (error.code === 'auth/weak-password') {
                Alert.alert('Ошибка', 'Пароль должен содержать не менее 6 символов.');
            } else {
                Alert.alert('Ошибка', error);
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
                    placeholder="введите почту"
                    textContentType={'emailAddress'}
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={'black'}
                />

                <View style={styles.input}>
                    <TextInput
                        style={styles.inputPass}
                        placeholder="введите пароль"
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="black"
                        secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={36}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.input}>
                    <TextInput
                        style={styles.inputPass}
                        placeholder="повторите пароль"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor="black"
                        secureTextEntry={!isConfirmPasswordVisible}
                    />
                    <TouchableOpacity
                        onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                            size={36}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => handleRegister()} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>создать аккаунт</Text>
                </TouchableOpacity>

                <Text style={styles.linkText}>Есть аккаунт?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Войти</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
