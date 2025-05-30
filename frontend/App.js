import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid, AppState, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import { getApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { useRefreshStore } from './store/auth';
import { navigationRef, navigate } from './navigation/RootNavigation';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('BG Message:', remoteMessage);
  // background processing only - no navigation here
});


const App = () => {
  const triggerInvitesRefresh = useRefreshStore(state => state.triggerInvitesRefresh);
  const triggerShoppingListsRefresh = useRefreshStore(state => state.triggerShoppingListsRefresh);
  const triggerFriendsRefresh = useRefreshStore(state => state.triggerFriendsRefresh);

  useEffect(() => {
    const app = getApp();

    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'KupMleko Notification Permission',
            message: 'We need permission to send you updates and list sharing alerts!',
            buttonPositive: 'OK',
          }
        );
      }
    };

    requestNotificationPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification?.title;
      const body = remoteMessage.notification?.body;

      if (["Friend invitation", "Zaproszenie do znajomych"].includes(title)) {
        setTimeout(() => Alert.alert(body), 0);
        console.log(remoteMessage)
        triggerInvitesRefresh();
      }
      else if (["New Shopping List Shared", "Masz nową listę od znajomego"].includes(title)) {
        setTimeout(() => Alert.alert(body), 0);
        triggerShoppingListsRefresh();
      }
      else if (["Zaproszenie przyjęte!", "Invite accepted!"].includes(title)) {
        setTimeout(() => Alert.alert(body), 0);
        triggerFriendsRefresh();
      }
    });

    return unsubscribe;
  }, [triggerInvitesRefresh, triggerShoppingListsRefresh, triggerFriendsRefresh]);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (!remoteMessage) return;
      const title = remoteMessage.notification?.title;
          if (["Friend invitation", "Zaproszenie do znajomych"].includes(title)) {
            triggerInvitesRefresh();
            navigate("Tabs", { screen: "FriendsTab" });
          }
          if (["New Shopping List Shared", "Masz nową listę od znajomego"].includes(title)) {
            triggerShoppingListsRefresh();
            navigate("Tabs", { screen: "ShoppingTab" });
          }
          if (["Zaproszenie przyjęte!", "Invite accepted!"].includes(title)) {
            triggerFriendsRefresh();
            navigate("Tabs", { screen: "FriendsTab" });
          }
    });

    return unsubscribe;
  }, [triggerInvitesRefresh]);


  useEffect(() => {
    const subscription = AppState.addEventListener("change", state => {
      if (state === "active") {
        triggerInvitesRefresh();
        triggerShoppingListsRefresh();
      }
    });

    return () => subscription.remove();
  }, [triggerInvitesRefresh, triggerShoppingListsRefresh]);

  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigation />
    </NavigationContainer>
  );
};

export default App;
