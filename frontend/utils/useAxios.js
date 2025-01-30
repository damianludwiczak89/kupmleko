import axios from "axios";
import { getRefreshedToken, isAccessTokenExpired, setAuthUser } from "./auth";
import { API_BASE_URL } from "./constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAxios = () => {
    const getTokens = async () => {
        const access_token = await AsyncStorage.getItem("access_token");
        const refresh_token = await AsyncStorage.getItem("refresh_token");
        return { access_token, refresh_token };
    };

    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization : `Bearer ${access_token}`}
    });

    axiosInstance.interceptors.request.use(async (req) => {
        const { access_token, refresh_token } = await getTokens();
        console.log(access_token, refresh_token)
        if(!isAccessTokenExpired(access_token)) {
            console.log('access token still valid')
            req.headers.Authorization = `Bearer ${access_token}`;
            return req;
        } 
        console.log('access expired')
        try {
        const response = await getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);
        req.headers.Authorization = `Bearer ${response.data?.access}`;
        console.log('token refreshed')
        return req;
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
        (error) => {
            return Promise.reject(error);
        }
    });
    
    return axiosInstance;
}

export default useAxios;