import { useAuthStore } from "../store/auth"
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { API_BASE_URL } from './constants';
import messaging from '@react-native-firebase/messaging';
import apiInstance from './axios';

export const login = async (email, password) => {
    try {
        const { data, status } = await axios.post(`${API_BASE_URL}user/token/`, {
            email,
            password,
        });
        console.log('status is', status)
        if (status === 200) {
            console.log('logged in 200')
            setAuthUser(data.access, data.refresh); // Save tokens to AsyncStorage
            console.log('tokens saved')
            await FCMTokenUpdate(); // Update token for push notification
        }

        return { data, error: null };

    } catch (error) {
        console.error("Error during login:", error);
        return {
            data: null,
            error: error.response?.data?.detail || "An error occurred. Please try again.",
        };
    }
};

export const register = async (full_name, email, password, password2) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}user/register/`, {
            full_name,
            email,
            password,
            password2,
        });
        await login(email, password);
        Alert.alert("Registration successfull");
        return {data, error: null}
    } catch (error) {

        if (!error.response || !error.response.data) {
            return {data: null, error: "Something went wrong"}
        }

        const { full_name, email, password } = error.response.data;

        const messages = [];
        if (full_name) messages.push(full_name);
        if (email) messages.push(email);
        if (password) messages.push(password);

        return {
            data: null,
            error: messages.length > 0 ? messages.join(" - ") : "Something went wrong"
        };
    }    
};

export const logout = async () => {
    await AsyncStorage.removeItem("@access_token");
    await AsyncStorage.removeItem("@refresh_token");
    useAuthStore.getState().setUser(null);
    Alert.alert("Logged out successfully")
};

export const setUser = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const refresh_token = await AsyncStorage.getItem("refresh_token");

    if (!access_token || !refresh_token) {
        Alert.alert("Tokens do not exist")
        return;
    }

    if (isAccessTokenExpired(access_token)) {
        console.log('access token expired')
        const response = await getRefreshedToken(refresh_token)
        setAuthUser(response.access, response.refresh)
    } else {
        setAuthUser(access_token, refresh_token);
    }
    
};


export const setAuthUser = async (access_token, refresh_token) => {
  try {
    await AsyncStorage.setItem('@access_token', JSON.stringify({
      token: access_token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day
    }));

    await AsyncStorage.setItem('@refresh_token', JSON.stringify({
      token: refresh_token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }));

    const user = jwtDecode(access_token);

    if (user) {
      const authStore = useAuthStore.getState();
      authStore.setUser(user);
    }
  } catch (error) {
    console.error('Error in setAuthUser:', error);
  }
};


export const getRefreshedToken = async () => {
    console.log('get refreshed token triggered');

    const storedToken = await AsyncStorage.getItem("@refresh_token");

    if (!storedToken) {
        console.log('No refresh token found.');
        return null;
    }

    const parsedToken = JSON.parse(storedToken);
    const refresh_token = parsedToken?.token || storedToken;

    if (!refresh_token) {
        console.log('No valid refresh token found.');
        return null;
    }

    console.log('Refresh token in refreshToken func:', refresh_token);

    try {
        const response = await axios.post(`${API_BASE_URL}user/token/refresh/`, {
            refresh: refresh_token,
        });

        console.log('New access token:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error refreshing token:', error.response?.data || error.message);
        logout();
        return null;
    }
};




export const isAccessTokenExpired = (access_token) => {
    try {
        console.log('is access token expired, access token:', access_token)
        const decodedToken = jwtDecode(access_token)
        console.log(decodedToken.exp < Date.now() / 1000)
        return decodedToken.exp < Date.now() / 1000
    } catch (error) {
        console.log('is access token expired, error catch:')
        console.log(error);
        return true;
    }
}

export const FCMTokenUpdate = async () => {
    console.log('fcm')
    const fcmToken = await messaging().getToken();
    try {
        await apiInstance.post('update_fcm_token/', {fcm_token: fcmToken});
    } catch (error) {
        console.log(error)
    }
}