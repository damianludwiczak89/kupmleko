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

apiInstance.interceptors.request.use(
  async (config) => {
    console.log('apiinterceptor');
    try {
      const accessToken = await AsyncStorage.getItem('@access_token');
      if (!accessToken) {
        console.warn("No access token found");
        return config;
      }

      let tokenData;
      try {
        tokenData = JSON.parse(accessToken);
      } catch (error) {
        console.error("Invalid JSON in AsyncStorage:", accessToken);
        await AsyncStorage.removeItem('@access_token');
        return config;
      }

      const token = tokenData?.token;
      if (!token) {
        console.warn("Token missing in stored object:", tokenData);
        return config;
      }

      if (isAccessTokenExpired(token)) {
        try {
          const response = await getRefreshedToken();
          setAuthUser(response.access, response.refresh);
          config.headers.Authorization = `Bearer ${response.access}`;
          console.log("Token refreshed");
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

export default apiInstance;