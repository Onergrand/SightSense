import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function App() {
  const showAlert = () => {
    Alert.alert("Button Pressed", "You pressed the button!");
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Главная страница</Text>
        <Text style={styles.text}>Добро пожаловать в наше приложение!</Text>
        <Button title="Нажми меня" onPress={showAlert} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
