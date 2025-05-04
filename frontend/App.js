import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import { useRefreshStore } from './store/auth';


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
      console.log('📩 FCM Message Received in foreground:', remoteMessage);
      if (remoteMessage['notification']['title'] === "Friend invitation") {
        triggerInvitesRefresh();
        console.log('refreshed invites after push not.')
      }
      else if (remoteMessage['notification']['title'] === "New Shopping List Shared") {
        triggerShoppingListsRefresh();
        console.log('refreshed shopping lists after push not.')
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
}

export default App;