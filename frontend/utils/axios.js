import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from './constants';
import { isAccessTokenExpired } from './auth';
import { getRefreshedToken } from './auth';
import { setAuthUser } from './auth';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// Add an interceptor to include the Authorization token in every request
apiInstance.interceptors.request.use(
  async (config) => {
    console.log('apiinstance intercetptor')
    const accessToken = await AsyncStorage.getItem('@access_token');
    const token = accessToken ? JSON.parse(accessToken).token : null;
      if(isAccessTokenExpired(accessToken)) {
        try {
        const response = await getRefreshedToken();
        setAuthUser(response.access, response.refresh);
        config.headers.Authorization = `Bearer ${response.access}`;
        console.log('token refreshed')
        return config;
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
        } 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
