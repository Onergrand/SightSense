import React from 'react';
import { View, StyleSheet } from 'react-native';
import Login from './tabs/auth';

export default function RootLayout() {
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
