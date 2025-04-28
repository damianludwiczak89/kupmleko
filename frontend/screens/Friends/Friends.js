import React, {useState, useEffect} from 'react';
import {  SafeAreaView, Text, Button, TextInput, View, TouchableOpacity } from 'react-native';
import apiInstance from '../../utils/axios';
import { Alert } from 'react-native';
import { useRefreshStore } from '../../store/auth'; 

const Friends = () => {

    const refreshToken = useRefreshStore(state => state.refreshToken);
    const triggerRefresh = useRefreshStore(state => state.triggerRefresh);

    const [email, setEmail] = useState('');
    const [invites, setInvites] = useState([]);
    const [friends, setFriends] = useState([]);

    const sendInvite = async (email) => {
      try {
        const response = await apiInstance.post('invite/', {email: email});
        console.log(response.data);
      } catch (error) {
        console.error('error', error)
        console.error('Error searching user:', error.response ? error.response.data : error.message);
        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Status:', error.response.status);
        }
      }
    }

    const getInvites = async () => {
      try {
        const response = await apiInstance.get('invite/');
        console.log('Invites:', response.data);
        setInvites(response.data);
      } catch (error) {
        console.error('error', error)
        console.error('Error fetching invites:', error.response ? error.response.data : error.message);
        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Status:', error.response.status);
        }
      }
    };

    const getFriends = async () => {
      try {
        const response = await apiInstance.get('friends/');
        console.log('Friends:', response.data);
        setFriends(response.data);
      } catch (error) {
        console.error('error', error)
        console.error('Error fetching friends:', error.response ? error.response.data : error.message);
        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Status:', error.response.status);
        }
      }
    };

    const acceptInvite = async (id) => {
      try {
        const response = await apiInstance.post('invite/accept/', {id: id});
        console.log(response.data);
        Alert.alert('Invite accepted!') 
        triggerRefresh();
      } catch (error) {
        console.error('error', error)
        console.error('Error accepting invite:', error.response ? error.response.data : error.message);
      }
    }

    const declineInvite = async () => {
      try {
        const response = await apiInstance.delete(`invite/${id}/`);
        console.log(response.data)
        triggerRefresh();
      } catch (error) {
        console.error('error', error)
        console.error('Error accepting invite:', error.response ? error.response.data : error.message);
      }
    }

    const removeFriend = async (id) => {
      try {
        const response = await apiInstance.delete(`friends/${id}/`);
        console.log(response.data)
        triggerRefresh();
      } catch (error) {
        console.error('error', error)
        console.error('Error deleting friend:', error.response ? error.response.data : error.message);
      }
    }

    const confirmRemoveFriend = (friendId) => {
      Alert.alert(
        'Remove Friend',
        'Are you sure you want to remove this friend?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => removeFriend(friendId),
          },
        ],
        { cancelable: true }
      );
    };

  useEffect(() => {
          getFriends();
          getInvites();
      }, [refreshToken])

    const mapped_invites = invites.map(item => (
      <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
        <Text style={{ flex: 1 }}>
          {item.from_user.username} ({item.from_user.email})
        </Text>
    
        <TouchableOpacity onPress={() => acceptInvite(item.id)} style={{ marginHorizontal: 5 }}>
          <Text style={{ fontSize: 24 }}>✅</Text>
        </TouchableOpacity>
    
        <TouchableOpacity onPress={() => declineInvite(item.id)} style={{ marginHorizontal: 5 }}>
          <Text style={{ fontSize: 16 }}>❌</Text>
        </TouchableOpacity>
      </View>
    ));

  const mapped_friends = friends.map(item => (
    <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
      <Text key={item.id}>{item.username} ({item.email})</Text>
      <TouchableOpacity onPress={() => confirmRemoveFriend(item.id)}>
        <Text style={{ fontSize: 24 }}>❌</Text>
      </TouchableOpacity>
    </View>
  ))

  return (
    <SafeAreaView>
          <TextInput
              style={{borderWidth: 1, padding: 10, borderRadius: 4}}
              value={email}
              onChangeText={value => setEmail(value)}
              placeholder='Email'
              autoFocus={false}
          />

          <Button title="Invite" onPress={() => sendInvite(email)} color="#841584" />
        <Text>Invites</Text>
        { mapped_invites }
        <Text>Friends</Text>
        { mapped_friends }

          
    </SafeAreaView>
  );
  
}

export default Friends;