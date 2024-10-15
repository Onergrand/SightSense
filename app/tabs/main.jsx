import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';

import {LinearGradient} from "expo-linear-gradient";
import {useFontSize} from "../utils/utils";
import createMainStyles from "../styles/main-styles";
import {Dropdown} from "react-native-element-dropdown";

export default function Main({ navigation }) {
    const [mode, setMode] = useState('');
    const [contrast, setContrast] = useState('');
    const { fontSize, setFontSize } = useFontSize();

    const styles = createMainStyles(fontSize);

    const handleCameraAction = () => {
        // add camera logic in future
        console.log(mode, contrast);
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
                    <View style={styles.cameraFill}>
                        <Text style={styles.cameraFillText}>
                            Нет изображения с камеры
                        </Text>
                    </View>
                </LinearGradient>

                <Text style={styles.pointName}>Выберите режим</Text>
                <Dropdown
                    style={styles.input}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.placeholder}
                    inputSearchStyle={styles.placeholder}
                    data={[
                        {label: 'Режим 1', value: 'first'},
                        {label: 'Режим 2', value: 'second'},
                        {label: 'Режим 3', value: 'third'},
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
                    placeholder="1.05"
                    defaultValue={"1.05"}
                    value={contrast}
                    onChangeText={setContrast}
                    placeholderTextColor={'black'}
                />

                <View style={styles.cameraActions}>
                    <TouchableOpacity onPress={handleCameraAction} style={styles.cameraActionButton}>
                        <Text style={styles.cameraActionButtonText}>старт</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraAction} style={styles.cameraActionButton}>
                        <Text style={styles.cameraActionButtonText}>стоп</Text>
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
        </View>
    );
}
