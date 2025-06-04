import React, { useCallback, useState } from 'react';
import { Text, 
  SafeAreaView, 
  Button, 
  TouchableOpacity, 
  View, 
  TextInput, 
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { logout } from '../../utils/auth';
import apiInstance from '../../utils/axios';
import { useAuthStore } from '../../store/auth';
import i18n from '../../i18n';
import { debounce } from 'lodash';
import styles from './styles';
import { Alert } from 'react-native';
import { useRefreshStore } from '../../store/auth';


const Settings = () => {
    const allUserData = useAuthStore((state) => state.allUserData)

    const setLanguage = useAuthStore((state) => state.setLanguage);
    const language = useAuthStore((state) => state.language);

    const setUser = useAuthStore((state) => state.setUser)

    const [username, setUsername] = useState(allUserData?.username)
    const triggerShoppingListsRefresh = useRefreshStore((state) => state.triggerShoppingListsRefresh);
    
    const changeLanguage = useCallback(
      debounce(async (newLanguage) => {
    try {
      await apiInstance.put('user/profile/', {'language': newLanguage});
      
    } catch (error) {
      console.error('error', error)
    }
  }, 500), [])


  const handleLanguageChange = (newLanguage) => { 
      setLanguage(newLanguage)
      allUserData.language = newLanguage;
      setUser(allUserData)
      changeLanguage(newLanguage)
      }

  const handleNameChange = useCallback(
      debounce(async (newName) => {
    try {
      await apiInstance.put('user/profile/', {'username': newName});
      allUserData.username = newName
      setUser(allUserData)
      triggerShoppingListsRefresh();
      Alert.alert(i18n.t('changedUsername', { locale: language }))
      
    } catch (error) {
      console.error('error', error)
    }
  }, 500), [])


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
        <View style={styles.stickyCard}>
          <Text style={{ textAlign: 'center', marginBottom: 16  }}>{allUserData?.email}</Text>

          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder={username}
          />
          <View style={{ marginBottom: 20 }}>
            <Button
              title={i18n.t('changeUsername', { locale: language })} 
              onPress={() => handleNameChange(username)}
            />
          </View>
    
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20, justifyContent: 'center', }}>
        <TouchableOpacity
          onPress={() => handleLanguageChange('pl')}
          style={[
            styles.languageButton,
            language === 'pl' && styles.languageButtonSelected,
          ]}
        >
          <Text style={styles.languageEmoji}>🇵🇱</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleLanguageChange('en')}
          style={[
            styles.languageButton,
            language === 'en' && styles.languageButtonSelected,
          ]}
        >
          <Text style={styles.languageEmoji}>🇬🇧</Text>
        </TouchableOpacity>
      </View>
          <Button title={i18n.t('logout', { locale: language })} onPress={logout} />
        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Settings;