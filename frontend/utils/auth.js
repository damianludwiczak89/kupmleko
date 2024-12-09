import { useAuthStore } from "../store/auth"
import axios from './axios'
import jwt_decode from 'jwt-decode'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
    try {
        const {data, status} = await axios.post('user/token/', {
            email,
            password,
        });

        if (status === 200) {
            setAuthUser(data.access, data.refresh);
            Alert.alert("Login successfull")
        }

        return {data, error: null};

    } catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || "Something went wrong",
        };
    }
};

export const register = async (full_name, email, password, password2) => {
    try {
        const {data} = await axios.post('user/register/', {
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

export const logout = () => {
    AsyncStorage.removeItem("access_token");
    AsyncStorage.removeItem("refresh_token");
    useAuthStore.getState().getUser(null);

    Alert.alert("Logged out successfully")
};

export const setUser = async () => {
    const access_token = AsyncStorage.getItem("access_token")
    const refresh_token = AsyncStorage.getItem("refresh_token")

    if (!access_token || !refresh_token) {
        Alert.alert("Tokens do not exist")
        return;
    }

    if (isAccessTokenExpired(access_token)) {
        const response = getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh)
    } else {
        setAuthUser(access_token, refresh_token);
    }
    
};

export const setAuthUser = (access_token, refresh_token) => {
    AsyncStorage.setItem('@access_token', JSON.stringify({
        token: access_token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 1 day
      }));
      AsyncStorage.setItem('@refresh_token', JSON.stringify({
        token: refresh_token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      }));

    const user = jwt_decode(access_token) ?? null

    if (user) {
        useAuthStore.getState().setUser(user);
    } 
    setAuthUser.getState().setLoading(false);
};

export const getRefreshedToken = async () => {
    const refresh_token = AsyncStorage.getItem("refresh_token");
    const response = await axios.post('token/refresh', {
        refresh: refresh_token,
    });
    return response.data;
}

export const isAccessTokenExpired = (access_token) => {
    try {
        const decodedToken = jwt_decode(access_token)
        return decodedToken.exp < Date.now() / 1000
    } catch (error) {
        console.log(error);
        return true;
    }
}