import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Friends from '../screens/Friends/Friends';
import History from '../screens/History/History';
import Settings from '../screens/Settings/Settings';
import {HomeStack, ListStack} from './ScreenStack';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    
    return (
        <Tab.Navigator

            screenOptions={({ route }) => ({
                headerTitleAlign: 'center',
                headerStyle: {
                  height: 40,
                  backgroundColor: 'white',
                },
                headerTitleStyle: {
                  fontSize: 16,
                },
                tabBarIcon: ({ focused }) => {
                let emoji = '🛒';

                if (route.name === 'Shopping') {
                    emoji = '🛍️';
                } else if (route.name === 'List') {
                    emoji = '📋';
                } else if (route.name === 'Friends') {
                    emoji = '👥';
                } else if (route.name === 'History') {
                    emoji = '📚';
                } else if (route.name === 'Settings') {
                    emoji = '⚙️';
                }

                return (
                    <Text style={{
                    fontSize: focused ? 24 : 24,
                    textAlign: 'center',
                    }}>
                    {emoji}
                    </Text>
                );
                },
            })}
            >
            <Tab.Screen
            name="Shopping"
            component={HomeStack}
            />
            <Tab.Screen
            name="List"
            component={ListStack}
            />
            <Tab.Screen
            name="Friends"
            component={Friends}
            />
            <Tab.Screen
            name="History"
            component={History}
            />
            <Tab.Screen
            name="Settings"
            component={Settings}
            />
        </Tab.Navigator>
    );

}

export default Tabs;