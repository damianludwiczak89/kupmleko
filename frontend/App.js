import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import { getApp } from '@react-native-firebase/app';
import { requestPermission, getMessaging, onMessage } from '@react-native-firebase/messaging';

const App = () => {
  
  useEffect(() => {
    const app = getApp();

    const requestPushPermission = async () => {
      const authStatus = await requestPermission();
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Push permission granted:', authStatus);
      } else {
        console.log('Push permission denied:', authStatus);
      }
    };

    requestPushPermission();

    const unsubscribe = onMessage(getMessaging(app), async remoteMessage => {
      console.log('📩 FCM Message Received in foreground:', remoteMessage);
    });

    return unsubscribe; // Cleanup the listener when App unmounts
  }, []);

  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
}

export default App;