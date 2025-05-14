import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import apiInstance from '../../utils/axios';
import { useRefreshStore } from '../../store/auth';
import styles from './styles';
import i18n from '../../i18n'; 
import { useAuthStore } from '../../store/auth';


const Friends = () => {
  const language = useAuthStore((state) => state.language);

  const friendsToken = useRefreshStore((state) => state.friendsToken);
  const triggerFriendsRefresh = useRefreshStore((state) => state.triggerFriendsRefresh);

  const invitesToken = useRefreshStore((state) => state.invitesToken);
  const triggerInvitesRefresh = useRefreshStore((state) => state.triggerInvitesRefresh);

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
      getInvites();
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  const getInvites = async () => {
    try {
      const response = await apiInstance.get('invite/');
      setInvites(response.data);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  const getFriends = async () => {
    try {
      const response = await apiInstance.get('friends/');
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const acceptInvite = async (id) => {
    try {
      await apiInstance.post('invite/accept/', { id });
      Alert.alert('Invite accepted!');
      triggerFriendsRefresh();
      triggerInvitesRefresh();
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
    }
  };

  const removeFriend = async (id) => {
    try {
      await apiInstance.delete(`friends/${id}/`);
      triggerFriendsRefresh();
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const confirmRemoveFriend = (id) => {
    Alert.alert(
      'Remove Friend',
      'Are you sure you want to remove this friend?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFriend(id) },
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.stickyCard}>
          <Text style={styles.sectionTitle}>{i18n.t('sendInvite',  { locale: language })}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={i18n.t('friendEmail',  { locale: language })}
          />
          <Button title={i18n.t('invite',  { locale: language })} onPress={() => sendInvite(email)} />
        </View>

        <View style={styles.stickyCard}>
          <Text style={styles.sectionTitle}>{i18n.t('pendingInvites',  { locale: language })}</Text>
          {mapped_invites.length > 0 ? mapped_invites 
          : <Text style={styles.subText}>{i18n.t('noInvites',  { locale: language })}</Text>}
        </View>

        <View style={styles.stickyCard}>
          <Text style={styles.sectionTitle}>{i18n.t('friends',  { locale: language })}</Text>
          {mapped_friends.length > 0 ? mapped_friends 
          : <Text style={styles.subText}>{i18n.t('noFriends',  { locale: language })}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Friends;
