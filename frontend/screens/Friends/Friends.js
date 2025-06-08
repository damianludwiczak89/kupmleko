import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import apiInstance from '../../utils/axios';
import { useRefreshStore } from '../../store/auth';
import styles from './styles';
import i18n from '../../i18n'; 
import { useAuthStore } from '../../store/auth';
import { Alert } from 'react-native';


const Friends = () => {
  const language = useAuthStore((state) => state.language);

  const friendsToken = useRefreshStore((state) => state.friendsToken);
  const triggerFriendsRefresh = useRefreshStore((state) => state.triggerFriendsRefresh);

  const invitesToken = useRefreshStore((state) => state.invitesToken);
  const triggerInvitesRefresh = useRefreshStore((state) => state.triggerInvitesRefresh);

  const triggerShoppingListsRefresh = useRefreshStore((state) => state.triggerShoppingListsRefresh);

  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingInvites, setLoadingInvites] = useState(true);

  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getFriends();
  }, [friendsToken]);

  useEffect(() => {
    getInvites();
  }, [invitesToken]);

  const sendInvite = async (email) => {
    try {
      await apiInstance.post('invite/', { email });
      setEmail('');
      Alert.alert(i18n.t('inviteSent', { locale: language }))
    } catch (error) {
        const translated = {
            "User not found": i18n.t('userNotFound', { locale: language }),
            "No User matches the given query.": i18n.t('userNotFound', { locale: language }),
            "Cannot invite yourself": i18n.t('inviteYourself', { locale: language }),
            "Invite already sent": i18n.t('inviteAlreadySent', { locale: language }),
            "Already a friend": i18n.t('alreadyFriend', { locale: language }),
            "Invite sent!": i18n.t('inviteSent', { locale: language }),
        }
      setEmail('');
      console.log(translated[error.response?.data?.detail || error.response?.data?.error])
      Alert.alert(translated[error.response?.data?.detail || error.response?.data?.error])
    }
  };

  const getInvites = async () => {
    try {
      const response = await apiInstance.get('invite/');
      setInvites(response.data);
      setLoadingInvites(false)
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  const getFriends = async () => {
    try {
      const response = await apiInstance.get('friends/');
      setFriends(response.data);
      setLoadingFriends(false)
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const acceptInvite = async (id) => {
    try {
      await apiInstance.post('invite/accept/', { id });
      Alert.alert(i18n.t('inviteAccepted',  { locale: language }));
      triggerFriendsRefresh();
      triggerInvitesRefresh();
      triggerShoppingListsRefresh();
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };

  const declineInvite = async (id) => {
    try {
      await apiInstance.delete(`invite/${id}/`);
      triggerInvitesRefresh();
    } catch (error) {
      console.error('Error declining invite:', error);
      triggerInvitesRefresh();
    }
  };

  const removeFriend = async (id) => {
    try {
      await apiInstance.delete(`friends/${id}/`);
      triggerFriendsRefresh();
      triggerShoppingListsRefresh();
    } catch (error) {
      console.error('Error removing friend:', error);
      triggerFriendsRefresh();
    }
  };

  const confirmRemoveFriend = (id) => {
    Alert.alert(
      i18n.t('removeFriend',  { locale: language }),
      i18n.t('removeFriendConfirm',  { locale: language }),
      [
        { text: i18n.t('cancel',  { locale: language }), style: 'cancel' },
        { text: i18n.t('remove',  { locale: language }), style: 'destructive', onPress: () => removeFriend(id) },
      ],
      { cancelable: true }
    );
  };

  const mapped_invites = invites.map((item) => (
    <View key={item.id} style={styles.listItem}>
      <Text style={styles.text}>
        {item.from_user.username} ({item.from_user.email})
      </Text>
      <TouchableOpacity onPress={() => acceptInvite(item.id)} style={styles.icon}>
        <Text style={styles.emoji}>✅</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => declineInvite(item.id)} style={styles.icon}>
        <Text style={styles.emoji}>❌</Text>
      </TouchableOpacity>
    </View>
  ));

  const mapped_friends = friends.map((item) => (
    <View key={item.id} style={styles.listItem}>
      <Text style={styles.text}>
        {item.username} ({item.email})
      </Text>
      <TouchableOpacity onPress={() => confirmRemoveFriend(item.id)} style={styles.icon}>
        <Text style={styles.emoji}>❌</Text>
      </TouchableOpacity>
    </View>
  ));

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
          <Text style={styles.sectionTitle}>{i18n.t('sendInvite',  { locale: language })}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={i18n.t('friendEmail',  { locale: language })}
          />
          <Button 
            title={i18n.t('invite',  { locale: language })} 
            onPress={() => sendInvite(email)}
            disabled={!email} />
        </View>
      <View>
        {mapped_invites.length > 0 ? 
          <View style={styles.stickyCard}>
                <Text style={styles.sectionTitle}>
                  {i18n.t('pendingInvites', { locale: language })}
                </Text>
                  {mapped_invites}     
          </View>
        : <View></View>}
       </View>

      <View style={styles.stickyCard}>
        {loadingFriends ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {i18n.t('friends', { locale: language })}
            </Text>
            {mapped_friends.length > 0 ? (
              mapped_friends
            ) : (
              <Text style={styles.subText}>{i18n.t('noFriends', { locale: language })}</Text>
            )}
          </>
        )}
      </View>

      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Friends;
