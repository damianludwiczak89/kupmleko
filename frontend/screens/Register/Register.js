import React, {useState} from 'react';
import {  SafeAreaView, Text, Button, TextInput, View } from 'react-native';
import { register } from '../../utils/auth';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import styles from '../auth_styles';

const Register = () => {

  const navigation = useNavigation();

  const handleSubmit = async (inputUsername, inputEmail, inputPassword, inputPassword2) => {
    const { error } = await register(inputUsername, inputEmail, inputPassword, inputPassword2);
  
    if (error) {
      alert(error);
    } else {
      console.log("Registered, logged in, tokens received");
    }
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoFocus
      />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        <Button
          title="Register"
          onPress={() => handleSubmit(username, email, password, confirmPassword)}
          color="#841584"
        />
      </View>

      <Text style={styles.text}>Already have an account?</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Login Here" onPress={() => navigation.navigate(Routes.Login)} />
      </View>
    </SafeAreaView>
  );
}

export default Register;