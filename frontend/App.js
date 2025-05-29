import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import { useRefreshStore } from './store/auth';
import { Alert } from 'react-native';


const App = () => {

  const triggerInvitesRefresh = useRefreshStore(state => state.triggerInvitesRefresh);
  const triggerShoppingListsRefresh = useRefreshStore(state => state.triggerShoppingListsRefresh);

  useEffect(() => {
    const app = getApp();

    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'BuddyBasket Notification Permission',
            message: 'We need permission to send you updates and list sharing alerts!',
            buttonPositive: 'OK',
          }
        );

      }
    };

    requestNotificationPermission();

    const unsubscribe = onMessage(getMessaging(app), async remoteMessage => {
      if (["Friend invitation", "Zaproszenie do znajomych"].includes(remoteMessage['notification']['title'])) {
        setTimeout(() => {
          Alert.alert(remoteMessage['notification']['body'])
        }, 0);
        triggerInvitesRefresh();
      }
      else if (["New Shopping List Shared", "Masz nową listę od znajomego"].includes(remoteMessage['notification']['title'])) {
        
        setTimeout(() => {
          Alert.alert(remoteMessage['notification']['body'])
        }, 0);
        triggerShoppingListsRefresh();
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", state => {
      if (state === "active") {
        triggerInvitesRefresh();
        triggerShoppingListsRefresh();
      }
    });

  return () => subscription.remove();
}, []);

  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
}

export default App;