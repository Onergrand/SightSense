import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import {LinearGradient} from "expo-linear-gradient";
import {useFontSize} from "../utils/utils";
import {Dropdown} from "react-native-element-dropdown";
import createRegisterDataStyles from "../styles/register-data-styles";


export default function RegisterData({ navigation }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const { fontSize, setFontSize } = useFontSize();

    const styles = createRegisterDataStyles(fontSize);

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

                    <Text style={styles.title}>Данные пользователя</Text>
                </LinearGradient>

                <TextInput
                    style={styles.input}
                    placeholder="введите имя"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={'black'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="введите фамилию"
                    value={surname}
                    onChangeText={setSurname}
                    placeholderTextColor={'black'}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="дата рождения"
                    value={dateOfBirth}
                    onChangeText={(date) => setDateOfBirth(date)}
                    placeholderTextColor={'black'}
                    keyboardType="numeric"
                    maxLength={10}
                />

                <Dropdown
                    style={styles.input}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.placeholder}
                    inputSearchStyle={styles.placeholder}
                    data={[
                        {label: 'мужской', value: 'male'},
                        {label: 'женский', value: 'female'},
                    ]}
                    labelField="label"
                    valueField="value"
                    placeholder="пол"
                    value={gender}
                    onChange={item => setGender(item.value)}
                />

                <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.saveDataButton}>
                    <Text style={styles.saveDataButtonText}>продолжить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
