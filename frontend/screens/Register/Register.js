import React, {useState} from 'react';
import {  SafeAreaView, Text, Button, TextInput } from 'react-native';
import { register } from '../../utils/auth';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';



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
    <SafeAreaView>


        <TextInput
            style={{borderWidth: 1, padding: 10, borderRadius: 4}}
            value={username}
            onChangeText={value => setUsername(value)}
            placeholder='Username'
            autoFocus={true}
        />

        <TextInput
            style={{borderWidth: 1, padding: 10, borderRadius: 4}}
            value={email}
            onChangeText={value => setEmail(value)}
            placeholder='Email'
            autoFocus={false}
        />

        <TextInput
            style={{borderWidth: 1, padding: 10, borderRadius: 4}}
            value={password}
            onChangeText={value => setPassword(value)}
            placeholder='Password'
            secureTextEntry={true}
        />

        <TextInput
            style={{borderWidth: 1, padding: 10, borderRadius: 4}}
            value={confirmPassword}
            onChangeText={value => setConfirmPassword(value)}
            placeholder='Confirm Password'
            secureTextEntry={true}
        />

        <Button title="Register" onPress={() => handleSubmit(username, email, password, confirmPassword)} color="#841584" />
        <Text>Already have an account?</Text>
        <Button title="Login Here" onPress={() => navigation.navigate(Routes.Login)} />

    </SafeAreaView>
  );
}

export default Register;