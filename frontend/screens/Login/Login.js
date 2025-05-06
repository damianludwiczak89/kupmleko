import React, {useState, useEffect} from 'react';
import {  SafeAreaView, Text, Button, TextInput, View } from 'react-native';
import { login, googleLogin } from '../../utils/auth';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import axios from "axios";
import { API_BASE_URL } from '../../utils/constants';
import { Alert } from 'react-native';
import styles from '../auth_styles';

const Login = () => {
  const navigation = useNavigation();


  const handleSubmit = async (inputUsername, inputPassword) => {
    console.log("Login button clicked"); 
    const { error } = await login(inputUsername, inputPassword);
  
    if (error) {
      console.log("Login error:", error);  
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

  const [resetPasswordToggle, setResetPasswordToggle] = useState(false)
  const [emailReset, setEmailReset] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleEmailReset = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}user/password-reset/${email}/`);
      console.log(response.data);
      Alert.alert('Reset password link sent to email')
    } catch (error) {
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Status code:', error.response.status);
        Alert.alert(error.response.data.message || 'Password reset failed');
      } else {
        console.log('Error message:', error.message);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Email"
        autoFocus
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        <Button title="Login" onPress={() => handleSubmit(username, password)} color="#841584" />
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Sign in with Google" onPress={handleGooglelogin} />
      </View>

      <Text style={styles.text}>Don’t have an account?</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Register" onPress={() => navigation.navigate(Routes.Register)} />
      </View>

      <Text style={styles.text}>Forgot password?</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Reset password" onPress={() => setResetPasswordToggle(!resetPasswordToggle)} />
      </View>

      {resetPasswordToggle && (
        <View style={styles.resetSection}>
          <TextInput
            style={styles.input}
            value={emailReset}
            onChangeText={setEmailReset}
            placeholder="Email"
          />
          <View style={styles.buttonWrapper}>
            <Button title="Send reset link" onPress={() => handleEmailReset(emailReset)} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Login;