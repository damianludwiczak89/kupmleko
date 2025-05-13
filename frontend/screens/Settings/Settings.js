import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, Button, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { logout } from '../../utils/auth';
import apiInstance from '../../utils/axios';
import { useAuthStore } from '../../store/auth';
import i18n from '../../i18n';


const Settings = () => {
    const allUserData = useAuthStore((state) => state.allUserData)

    const setLanguage = useAuthStore((state) => state.setLanguage);
    const language = useAuthStore((state) => state.language);
    
    const changeLanguage = async (newLanguage) => {
    try {
      await apiInstance.put('user/profile/', {'language': newLanguage});
      setLanguage(newLanguage)
    } catch (error) {
      console.error('error', error)
    }
  };



  return (
    <SafeAreaView>
        <ScrollView>
          <Text>{i18n.t('friends',  { locale: language })}</Text>
            <TouchableOpacity
            onPress={() => changeLanguage('pl')}
            >
              <Text>🇵🇱</Text>
            </TouchableOpacity>
              <TouchableOpacity
            onPress={() => changeLanguage('en')}
            >
              <Text>🇬🇧</Text>
            </TouchableOpacity>
            <Button title="Logout" onPress={async () => {
              await logout(); 
            }} />
        </ScrollView>
    </SafeAreaView>
  );
}

export default Settings;