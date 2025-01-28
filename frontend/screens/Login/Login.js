import React, {useState} from 'react';
import {  SafeAreaView, Text, Button, TextInput } from 'react-native';
import { login } from '../../utils/auth';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';



const Login = () => {
  const navigation = useNavigation();

  const handleSubmit = async (inputUsername, inputPassword) => {
    console.log("Login button clicked"); 
    const { error } = await login(inputUsername, inputPassword);
  
    if (error) {
      console.log("Login error:", error);  
      alert(error);
    } else {
      console.log("Login successful, tokens received");
      
      navigation.navigate(Routes.Home)
    }
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView>

        <Text>Login</Text>

        <TextInput
            style={{borderWidth: 1, padding: 10, borderRadius: 4}}
            value={username}
            onChangeText={value => setUsername(value)}
            placeholder='Username'
            autoFocus={true}
        />

        <TextInput
            style={{borderWidth: 1, padding: 10, borderRadius: 4}}
            value={password}
            onChangeText={value => setPassword(value)}
            placeholder='Password'
            secureTextEntry={true}
        />

        <Button title="Login" onPress={() => handleSubmit(username, password)} color="#841584" />

        <Text>Do not have an account?</Text>
        <Button title="Register" onPress={() => navigation.navigate(Routes.Register)} />

    </SafeAreaView>
  );
}

export default Login;