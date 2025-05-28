import React, {useState, useEffect} from 'react';
import {  SafeAreaView, Text, Button, TextInput, View, TouchableOpacity } from 'react-native';
import { login, googleLogin } from '../../utils/auth';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import axios from "axios";
import { API_BASE_URL } from '../../utils/constants';
import { Alert } from 'react-native';
import styles from '../auth_styles';
import { useAuthStore } from '../../store/auth';
import i18n from '../../i18n';

const Login = () => {
  const navigation = useNavigation();

  const setLanguage = useAuthStore((state) => state.setLanguage);
  const language = useAuthStore((state) => state.language);

  const handleSubmit = async (inputUsername, inputPassword) => {
    console.log("Login button clicked"); 
    const { error } = await login(inputUsername, inputPassword);
  
    if (error) {
    const translated = {
        "No active account found with the given credentials": i18n.t('noAccount', { locale: language }),
        "Incorrect password": i18n.t('wrongPassword', { locale: language }),
      }
      console.log(error)
      Alert.alert(translated[error] || error);
    };
  }

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
      Alert.alert(i18n.t('resetPassword',  { locale: language }))
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
      <View style={styles.languageContainer}>
        <TouchableOpacity
          onPress={() => setLanguage('pl')}
          style={[
            styles.languageButton,
            language === 'pl' && styles.languageButtonSelected,
          ]}
        >
          <Text style={styles.languageEmoji}>🇵🇱</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setLanguage('en')}
          style={[
            styles.languageButton,
            language === 'en' && styles.languageButtonSelected,
          ]}
        >
          <Text style={styles.languageEmoji}>🇬🇧</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>{i18n.t('login',  { locale: language })}</Text>

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
        placeholder={i18n.t('password',  { locale: language })}
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        <Button 
          title={i18n.t('login',  { locale: language })} 
          onPress={() => handleSubmit(username, password)} color="#841584"
          disabled={!username || !password} />
      </View>

      <View style={styles.buttonWrapper}>
        <Button title={i18n.t('googleSignIn',  { locale: language })} onPress={handleGooglelogin} />
      </View>

      <Text style={styles.text}>{i18n.t('accountQuestion',  { locale: language })}</Text>
      <View style={styles.buttonWrapper}>
        <Button title={i18n.t('register',  { locale: language })} onPress={() => navigation.navigate(Routes.Register)} />
      </View>

      <Text style={styles.text}>{i18n.t('forgotPassword',  { locale: language })}</Text>
      <View style={styles.buttonWrapper}>
        <Button title={i18n.t('resetPassword',  { locale: language })} onPress={() => setResetPasswordToggle(!resetPasswordToggle)} />
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
            <Button title={i18n.t('resetLink',  { locale: language })} onPress={() => handleEmailReset(emailReset)} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Login;