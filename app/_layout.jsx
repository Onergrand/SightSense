import React from 'react';
import {useFonts} from "expo-font";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './tabs/auth';
import Register from "./tabs/register";
import Main from "./tabs/main";
import Profile from "./tabs/profile";
import ProfileEdit from "./tabs/profile-edit";
import RegisterData from "./tabs/register-data";

const Stack = createStackNavigator();

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
        <NavigationContainer independent={true}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Register" component={Register}/>
                <Stack.Screen name="RegisterData" component={RegisterData}/>
                <Stack.Screen name="Main" component={Main}/>
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen name="ProfileEdit" component={ProfileEdit}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
