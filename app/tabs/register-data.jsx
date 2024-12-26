import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import { LinearGradient } from "react-native-linear-gradient";
import { useFontSize } from "../utils/utils";
import { Dropdown } from "react-native-element-dropdown";
import createRegisterDataStyles from "../styles/register-data-styles";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";


export default function RegisterData({ navigation }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('unknown');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const { fontSize, setFontSize } = useFontSize();

    const styles = createRegisterDataStyles(fontSize);

    const handleRegisterData = async () => {
        try {
            const docRef = doc(FIREBASE_DB, "users", FIREBASE_AUTH.currentUser.uid, "data", "userData");
            await setDoc(docRef, {
                name: name,
                surname: surname,
                dateOfBirth: dateOfBirth,
                gender: gender
            });

            navigation.navigate('Main');
        } catch (e) {
            console.error("Error adding document: ", e);
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

    const formatDateOfBirth = (text) => {
        let cleanText = text.replace(/\D/g, ''); // Удалить все символы, кроме цифр
        if (cleanText.length > 2) {
            cleanText = cleanText.slice(0, 2) + '.' + cleanText.slice(2);
        }
        if (cleanText.length > 5) {
            cleanText = cleanText.slice(0, 5) + '.' + cleanText.slice(5, 9);
        }
        return cleanText;
    };

    const isDateValid = (dateString) => {
        const parts = dateString.split('.'); // Разделяем по точкам
        if (parts.length !== 3) return false;

        const [day, month, year] = parts.map(part => parseInt(part, 10));
        const today = new Date();

        if (year < 1900 || year > today.getFullYear()) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > new Date(year, month, 0).getDate()) return false;

        const inputDate = new Date(year, month - 1, day);
        return inputDate <= today;
    };

    const handleDateOfBirthChange = (text) => {
        const formattedText = formatDateOfBirth(text);
        setDateOfBirth(formattedText);
    };

    useEffect(() => {
        if (
            name.trim() &&
            surname.trim() &&
            dateOfBirth.trim() &&
            isDateValid(dateOfBirth) &&
            gender !== 'unknown'
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, surname, dateOfBirth, gender]);

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
                />
                <TextInput
                    style={styles.input}
                    placeholder="дата рождения"
                    textContentType={"birthdate"}
                    value={dateOfBirth}
                    onChangeText={handleDateOfBirthChange}
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
                        { label: 'мужской', value: 'male' },
                        { label: 'женский', value: 'female' },
                    ]}
                    labelField="label"
                    valueField="value"
                    placeholder="пол"
                    value={gender}
                    onChange={item => setGender(item.value)}
                    itemTextStyle={{ color: "#000" }}
                />

                <TouchableOpacity
                    onPress={() => handleRegisterData()}
                    style={[
                        styles.saveDataButton,
                        isButtonDisabled && { backgroundColor: 'gray' },
                    ]}
                    disabled={isButtonDisabled}
                >
                    <Text style={styles.saveDataButtonText}>продолжить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
