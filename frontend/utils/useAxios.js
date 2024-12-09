import axios from "axios";
import { getRefreshedToken, isAccessTokenExpired, setAuthUser } from "./auth";
import { API_BASE_URL } from "./constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAxios = () => {
    const access_token = AsyncStorage.getItem("access_token")
    const refresh_token = AsyncStorage.getItem("refresh_token")

    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization : `Bearer ${access_token}`}
    });

    axiosInstance.interceptors.request.use(async (req) => {
        if(!isAccessTokenExpired) {
            return req;
        } 

        const response = await getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);
        req.headers.Authorization = `Bearer ${response.data?.access}`;
        return req;
    });
    
    return axiosInstance;
}

export default useAxios;