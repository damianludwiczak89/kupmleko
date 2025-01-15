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

  const handleSubmit = async () => {
    console.log("Login button clicked"); 
    logout();
  
    }
  

    const getFriends = async () => {
        try {
          // Make the request to the API
          const response = await apiInstance.get('friends/'); // Your API endpoint here
          console.log('Friends:', response.data); // Log the response data
        } catch (error) {
          console.error('Error fetching friends:', error.response ? error.response.data : error.message);
        }
      };

    useFocusEffect(
        React.useCallback(() => {
          const fetchToken = async () => {
            try {
              const token = await AsyncStorage.getItem("@access_token");
              console.log("Access Token:", token); // This will log the token or null if not found
            } catch (error) {
              console.log("Error fetching token:", error);
            }
          };
    
          fetchToken();
          getFriends();
    
          // You can return a cleanup function if needed
          return () => {
            console.log("Home screen unfocused");
          };
        }, []) // Empty dependency array means this will run on every focus
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