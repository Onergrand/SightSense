import React, {useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import Login from './tabs/auth';
import Register from "./tabs/register";
import {useFonts} from "expo-font";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        MontserratRegular: require('../assets/fonts/Montserrat-Regular.ttf'),
        MontserratMedium: require('../assets/fonts/Montserrat-Medium.ttf'),
        MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
        MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Login />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        margin: 0,
        padding: 0,
    }
});
