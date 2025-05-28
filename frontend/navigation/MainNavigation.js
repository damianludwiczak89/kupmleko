import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import { isAccessTokenExpired, getRefreshedToken } from "../utils/auth";
import { View, ActivityIndicator } from 'react-native';
import Tabs from "./Tabs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiInstance from "../utils/axios";

const Stack = createStackNavigator();

const MainNavigation = () => {
    const allUserData = useAuthStore((state) => state.allUserData);
    const setUser = useAuthStore((state) => state.setUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("Checking auth...");

                const access_token = await AsyncStorage.getItem("@access_token");
    
                if (!access_token) {
                    console.log("No token found, logging out.");
                    setUser(null);
                    setLoading(false);
                    return;
                }

                if (isAccessTokenExpired(access_token)) {
                    console.log("Token expired, trying to refresh...");
                    const refreshedToken = await getRefreshedToken();
    
                    if (refreshedToken && refreshedToken.access) {
                        console.log("Token refreshed successfully.");
                        console.log("new access:, ", refreshedToken);
                        console.log(".access:, ", refreshedToken.access);
                        await AsyncStorage.setItem('@access_token', JSON.stringify({
                            token: refreshedToken.access,
                            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day
                          }));
                        const userProfile = await apiInstance.get('user/profile/');
                        setUser(userProfile.data);
                    } else {
                        console.log("Token refresh failed, logging out.");
                        await AsyncStorage.removeItem("@access_token");
                        setUser(null);
                    }
                } else {
                    const userProfile = await apiInstance.get('user/profile/');
                    setUser(userProfile.data);
                }
            } catch (error) {
                console.error("Error in checkAuth:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
    
        checkAuth();
    }, []); // Run once on component mount
    

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {allUserData ? (
                <Stack.Screen name="Tabs" component={Tabs} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default MainNavigation;
