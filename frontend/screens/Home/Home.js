import React, { useEffect } from 'react';
import {  SafeAreaView, Text, Button } from 'react-native';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../utils/auth';
import { useFocusEffect } from '@react-navigation/native';
import apiInstance from '../../utils/axios';

const Home = () => {

    const navigation = useNavigation();


    const getFriends = async () => {
        try {
          const response = await apiInstance.get('friends/');
          console.log('Friends:', response.data);
        } catch (error) {
          console.error('Error fetching friends:', error.response ? error.response.data : error.message);
        }
      };

    useFocusEffect(
        React.useCallback(() => {
          const fetchToken = async () => {
            try {
              const token = await AsyncStorage.getItem("@access_token");
              console.log("Access Token:", token);
            } catch (error) {
              console.log("Error fetching token:", error);
            }
          };
    
          fetchToken();
          getFriends();
    
          
          return () => {
            console.log("Home screen unfocused");
          };
        }, [])
      );



    console.log("Component Rendered");

    return (
        <SafeAreaView>
            <Text>Hello</Text>
            <Button title="Login Here" onPress={() => navigation.navigate(Routes.Login)} />
            <Button title="Logout" onPress={() => logout()} />
        </SafeAreaView>
    );
};

export default Home;