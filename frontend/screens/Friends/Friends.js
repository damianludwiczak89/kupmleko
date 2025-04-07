import React, {useState} from 'react';
import {  SafeAreaView, Text, Button, TextInput } from 'react-native';
import apiInstance from '../../utils/axios';
import { useFocusEffect } from '@react-navigation/native';

const Friends = () => {

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


  useFocusEffect(
      React.useCallback(() => {
          getInvites();
          getFriends();
      }, [])
    );

  const mapped_invites = invites.map(item => (
    <Text key={item.id}>{item.from_user.username} ({item.from_user.email})</Text>
  )) 

  const mapped_friends = friends.map(item => (
    <Text key={item.id}>{item.username} ({item.email})</Text>
  ))

  return (
    <SafeAreaView>
      <Text>Friends</Text>

          <TextInput
              style={{borderWidth: 1, padding: 10, borderRadius: 4}}
              value={email}
              onChangeText={value => setEmail(value)}
              placeholder='Email'
              autoFocus={true}
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