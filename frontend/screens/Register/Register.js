import React, {useState} from 'react';
import {  SafeAreaView, 
  Text, 
  Button, 
  TextInput, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback } from 'react-native';
import { register } from '../../utils/auth';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import styles from '../auth_styles';
import { useAuthStore } from '../../store/auth';
import i18n from '../../i18n';

const Register = () => {

  const navigation = useNavigation();

  const setLanguage = useAuthStore((state) => state.setLanguage);
  const language = useAuthStore((state) => state.language);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (inputUsername, inputEmail, inputPassword, inputPassword2, userLanguage) => {
    if (loading) return; // prevent fast double-taps

    setLoading(true);
    try {
      const { error } = await register(inputUsername, inputEmail, inputPassword, inputPassword2, userLanguage);

      if (error) {
        alert(error);
      } else {
        console.log("Registered, logged in, tokens received");
      }
    } catch (e) {
      alert('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userLanguage, setUserLanguage] = useState('pl');

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
        <Text style={styles.header}>{i18n.t('register',  { locale: language })}</Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder={i18n.t('username',  { locale: language })}
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
          placeholder={i18n.t('password',  { locale: language })}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={i18n.t('passwordConfirm',  { locale: language })}
          secureTextEntry
        />

        <View style={styles.languageContainer}>
          <TouchableOpacity
            onPress={() => {setUserLanguage('pl'); setLanguage('pl')}}
            style={[
              styles.languageButton,
              userLanguage === 'pl' && styles.languageButtonSelected,
            ]}
          >
            <Text style={styles.languageEmoji}>🇵🇱</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {setUserLanguage('en'); setLanguage('en')}}
            style={[
              styles.languageButton,
              userLanguage === 'en' && styles.languageButtonSelected,
            ]}
          >
            <Text style={styles.languageEmoji}>🇬🇧</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title={i18n.t('register',  { locale: language })}
            onPress={() => handleSubmit(username, email, password, confirmPassword, userLanguage)}
            color="#841584"
            disabled={!username || !email || !password || !confirmPassword || loading}
          />
        </View>

        <Text style={styles.text}>{i18n.t('accountQuestion2',  { locale: language })}</Text>
        <View style={styles.buttonWrapper}>
          <Button title={i18n.t('login',  { locale: language })} onPress={() => navigation.navigate(Routes.Login)} />
        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Register;