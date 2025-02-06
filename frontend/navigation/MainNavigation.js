import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth'
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import { isAccessTokenExpired } from "../utils/auth";
import { getRefreshedToken } from "../utils/auth";
import { View , ActivityIndicator} from 'react-native';
import Tabs from "./Tabs";

const Stack = createStackNavigator();

const MainNavigation = () => {
    let { isLoggedIn } = useAuthStore();
    isLoggedIn = isLoggedIn();

    console.log(isLoggedIn);
    if (isLoggedIn === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
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