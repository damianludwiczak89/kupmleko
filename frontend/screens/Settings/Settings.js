import React, { useCallback } from 'react';
import { Text, SafeAreaView, Button, TouchableOpacity, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { logout } from '../../utils/auth';
import apiInstance from '../../utils/axios';
import { useAuthStore } from '../../store/auth';
import i18n from '../../i18n';
import { debounce } from 'lodash';
import styles from './styles';


const Settings = () => {
    const allUserData = useAuthStore((state) => state.allUserData)

    const setLanguage = useAuthStore((state) => state.setLanguage);
    const language = useAuthStore((state) => state.language);

    const setUser = useAuthStore((state) => state.setUser)
    
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


   return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.stickyCard}>
          <Text style={{ textAlign: 'center', marginBottom: 16  }}>{allUserData?.email}</Text>
    
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
    </SafeAreaView>
  );
};

export default Settings;