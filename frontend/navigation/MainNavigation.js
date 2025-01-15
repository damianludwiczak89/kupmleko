import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from './Routes';
import Home from '../screens/Home/Home';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';

const Stack = createStackNavigator();

const MainNavigation = () => {
    return (
    <Stack.Navigator initialRouteName={Routes.Home}>
        <Stack.Screen name={Routes.Login} component={Login} />
        <Stack.Screen name={Routes.Register} component={Register} />
        <Stack.Screen name={Routes.Home} component={Home} />

    </Stack.Navigator>
    );
};

export default MainNavigation;