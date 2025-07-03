import React, {useState, useEffect} from 'react';
import {  SafeAreaView, 
  Text, 
  Button, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard } from 'react-native';
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
  const language = useAuthStore((state) => state.language || 'pl');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);

  const handleSubmit = async (inputUsername, inputPassword) => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    try {
      console.log("Login button clicked");
      const { error } = await login(inputUsername, inputPassword);

      if (error) {
        const translated = {
          "No active account found with the given credentials": i18n.t('noAccount', { locale: language }),
          "Incorrect password": i18n.t('wrongPassword', { locale: language }),
        };
        console.log(error);
        Alert.alert(translated[error] || error);
      }
    } catch (e) {
      Alert.alert('Unexpected error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGooglelogin = async (language) => {
    if (isGoogleLoggingIn) return;

    setIsGoogleLoggingIn(true);
    try {
      console.log(language);
      const response = await googleLogin(language);
      if (response) {
        console.log('google login success');
      } else {
        console.log('google login failed');
      }
    } catch (e) {
      Alert.alert('Google Sign-in Error');
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [resetPasswordToggle, setResetPasswordToggle] = useState(false)
  const [emailReset, setEmailReset] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);
  

  const translatedReset = {
    "User not found": i18n.t('noUserFound', { locale: language }),
    "Cannot reset password for google account login": i18n.t('resetGooglePassword', { locale: language }),
    "Password reset email sent successfully": i18n.t('resetSent', { locale: language }),
  }

  const handleEmailReset = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}user/password-reset/${email}/`);
      console.log(response.data);
      Alert.alert(i18n.t('resetSent',  { locale: language }))
    } catch (error) {
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Status code:', error.response.status);
        Alert.alert(translatedReset[error.response.data.message] || i18n.t('resetFailed', { locale: language }));
      } else {
        console.log('Error message:', error.message);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
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
            disabled={!username || !password || isLoggingIn} />
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.googleButton} onPress={() => handleGooglelogin(language)} disabled={isGoogleLoggingIn}>
            <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>
              {i18n.t('googleSignIn', { locale: language })}
            </Text>
          </TouchableOpacity>
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
            <View style={styles.buttonWrapper}>
            <Button 
              title={i18n.t('resetLink',  { locale: language })} 
              onPress={() => handleEmailReset(emailReset)} 
              disabled={!emailReset}/>
            </View>
            <TextInput
              style={styles.input}
              value={emailReset}
              onChangeText={setEmailReset}
              placeholder="Email"
            />
          </View>
        )}
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Login;