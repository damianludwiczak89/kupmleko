import React, {useState, useEffect} from 'react';
import {  SafeAreaView, Text, Button, TextInput } from 'react-native';
import { login, googleLogin } from '../../utils/auth';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

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
    }
  };

  const handleGooglelogin = async () => {
    const response = await googleLogin();
    if (response) {
      console.log('google login success')
    } else {
      console.log('google login failed')
    }
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  return (
    <SafeAreaView>

        <Text>Login</Text>

        <TextInput
            style={{borderWidth: 1, padding: 10, borderRadius: 4}}
            value={username}
            onChangeText={value => setUsername(value)}
            placeholder='Email'
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
        <Button title="Sign in with Google" onPress={handleGooglelogin} />

        <Text>Do not have an account?</Text>
        <Button title="Register" onPress={() => navigation.navigate(Routes.Register)} />

    </SafeAreaView>
  );
}

export default Login;