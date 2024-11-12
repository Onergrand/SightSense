import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useFontSize } from "../utils/utils";
import { Dropdown } from "react-native-element-dropdown";
import createProfileStyles from "../styles/profile-styles";
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";

export default function Profile({ navigation }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const { fontSize, setFontSize } = useFontSize();

    const styles = createProfileStyles(fontSize);

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

    // Функция для получения данных пользователя из Firestore
    const fetchUserData = async () => {
        try {
            const querySnapshot = await getDocs(collection(FIREBASE_DB, "users/" + FIREBASE_AUTH.currentUser.uid + "/data"));
            if (!querySnapshot.empty) {
                const user = querySnapshot.docs[0].data();
                setName(user.name);
                setSurname(user.surname);
                setDateOfBirth(user.dateOfBirth);
                setGender(user.gender);
            }
        } catch (error) {
            console.error('Error fetching user data: ', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>

                <LinearGradient
                    colors={['#F8DDF4', 'transparent']}
                    style={styles.background}>

                    <View style={styles.topMenuContainer}>
                        <TouchableOpacity onPress={() => handleLogout()} style={styles.exitButton}>
                            <Text style={styles.exitButtonText}>Выйти</Text>
                        </TouchableOpacity>

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

                <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')} style={styles.changeDataButton}>
                    <Text style={styles.changeDataButtonText}>Редактировать</Text>
                </TouchableOpacity>

                <View style={styles.bottomMenu}>
                    <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.bottomMenuButton}>
                        <Image source={require('../../assets/images/home-icon.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomMenuButton}>
                        <Image source={require('../../assets/images/profile-icon.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
