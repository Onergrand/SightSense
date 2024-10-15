import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';

import {LinearGradient} from "expo-linear-gradient";
import {useFontSize} from "../utils/utils";
import {Dropdown} from "react-native-element-dropdown";
import createProfileEditStyles from "../styles/profile-edit-styles";


export default function ProfileEdit({ navigation }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const { fontSize, setFontSize } = useFontSize();

    const styles = createProfileEditStyles(fontSize);

    const saveAdditionalData = () => {
        // add firebase register logic in future
        console.log(name, surname, dateOfBirth, gender);
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
                    style={styles.background}>

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
                    <Text style={styles.title}>Профиль</Text>
                </LinearGradient>

                <Text style={styles.pointName}>Имя</Text>
                <TextInput
                    style={styles.input}
                    placeholder="введите имя"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={'black'}
                />

                <Text style={styles.pointName}>Фамилия</Text>
                <TextInput
                    style={styles.input}
                    placeholder="введите фамилию"
                    value={surname}
                    onChangeText={setSurname}
                    placeholderTextColor={'black'}
                    secureTextEntry
                />

                <Text style={styles.pointName}>Дата рождения</Text>
                <TextInput
                    style={styles.input}
                    placeholder="дата рождения"
                    value={dateOfBirth}
                    onChangeText={(date) => setDateOfBirth(date)}
                    placeholderTextColor={'black'}
                    keyboardType="numeric"
                    maxLength={10}
                />

                <Text style={styles.pointName}>Пол</Text>
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

                <TouchableOpacity style={styles.changeDataButton}>
                    <Text style={styles.changeDataButtonText}>Сохранить</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.changeDataButton}>
                    <Text style={styles.changeDataButtonText}>Назад</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
