import React, {useState} from 'react';
import {  SafeAreaView, Text, Button, TextInput } from 'react-native';
import apiInstance from '../../utils/axios';
import { useFocusEffect } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Friends = () => {

    const [email, setEmail] = useState('');
    const [invites, setInvites] = useState('');
    const [friends, setFriends] = useState('');

    const handleClick = async (email) => {
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

          <Button title="Invite" onPress={() => handleClick(email)} color="#841584" />
        <Text>Invites</Text>
        <Text>Friends</Text>

          
    </SafeAreaView>
  );
  
}

export default Friends;