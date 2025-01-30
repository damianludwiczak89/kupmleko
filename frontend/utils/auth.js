import { useAuthStore } from "../store/auth"
import apiInstance from './axios'
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { API_BASE_URL } from './constants';

export const login = async (email, password) => {
    try {
        const { data, status } = await apiInstance.post('user/token/', {
            email,
            password,
        });

        if (status === 200) {
            setAuthUser(data.access, data.refresh);
        }

        return { data, error: null };

    } catch (error) {
        console.error("Error during login:", error);
        console.error("Error details:", error.response?.data || error.message);

        return {
            data: null,
            error: error.response?.data?.detail || "An error occurred. Please try again.",
        };
    }
};

export const register = async (full_name, email, password, password2) => {
    try {
        const {data} = await apiInstance.post('user/register/', {
            full_name,
            email,
            password,
            password2,
        });
        await login(email, password);
        Alert.alert("Registration successfull");
        return {data, error: null}
    } catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || "Something went wrong",
        };
    }    
};

export const logout = async () => {
    await AsyncStorage.removeItem("@access_token");
    await AsyncStorage.removeItem("@refresh_token");
    useAuthStore.getState().setUser(null);
    console.log('logged out due to old tokens')
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

    // Retrieve token from AsyncStorage
    const storedToken = await AsyncStorage.getItem("@refresh_token");

    // Check if token exists and parse if necessary
    const refresh_token = storedToken ? JSON.parse(storedToken).token || storedToken : null;

    if (!refresh_token) {
        console.log('No valid refresh token found.');
        return null;
    }

    console.log('Refresh token in refreshToken func:', refresh_token); // Should log a valid token string

    try {
        const response = await axios.post(`${API_BASE_URL}user/token/refresh/`, {
            refresh: refresh_token,  // Send correct token format
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