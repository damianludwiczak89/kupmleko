import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid, AppState, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import { getApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { useRefreshStore } from './store/auth';
import { navigationRef, navigate } from './navigation/RootNavigation';



const App = () => {
  const triggerInvitesRefresh = useRefreshStore(state => state.triggerInvitesRefresh);
  const triggerShoppingListsRefresh = useRefreshStore(state => state.triggerShoppingListsRefresh);
  const triggerFriendsRefresh = useRefreshStore(state => state.triggerFriendsRefresh);

  useEffect(() => {


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
      const body = remoteMessage.notification?.body;
      const type = remoteMessage.data.type;

      console.log(remoteMessage)

      if (type==='invite_received') {
        setTimeout(() => Alert.alert(body), 0);
        console.log(remoteMessage)
        triggerInvitesRefresh();
      }
      else if (type==='new_list') {
        setTimeout(() => Alert.alert(body), 0);
        triggerShoppingListsRefresh();
      }
      else if (type==='invite_accepted') {
        setTimeout(() => Alert.alert(body), 0);
        triggerFriendsRefresh();
      }
      else if (type==='archived') {
        setTimeout(() => Alert.alert(body), 0);
        triggerShoppingListsRefresh();
      }
    });

    return unsubscribe;
  }, [triggerInvitesRefresh, triggerShoppingListsRefresh, triggerFriendsRefresh]);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (!remoteMessage) return;
      console.log(remoteMessage)
      const type = remoteMessage.data.type;
          if (type==='invite_received') {
            triggerInvitesRefresh();
            navigate("Tabs", { screen: "FriendsTab" });
          }
          if (type==='new_list') {
            triggerShoppingListsRefresh();
            navigate("Tabs", { screen: "ShoppingTab" });
          }
          if (type==='invite_accepted') {
            triggerFriendsRefresh();
            navigate("Tabs", { screen: "FriendsTab" });
          }
          if (type==='archived') {
            triggerFriendsRefresh();
            navigate("Tabs", { screen: "HistoryTab" });
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
