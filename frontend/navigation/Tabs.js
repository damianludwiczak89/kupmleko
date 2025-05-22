import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Friends from '../screens/Friends/Friends';
import History from '../screens/History/History';
import Settings from '../screens/Settings/Settings';
import {HomeStack, ListStack} from './ScreenStack';
import { Text, View } from 'react-native';
import i18n from '../i18n';
import { useAuthStore } from '../store/auth';

const Tab = createBottomTabNavigator();

const Tabs = () => {

    const language = useAuthStore((state) => state.language);
    
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

                if (route.name === "Shopping") {
                    emoji = '🛍️';
                } else if (route.name === "Lists") {
                    emoji = '📋';
                } else if (route.name === "Friends") {
                    emoji = '👥';
                } else if (route.name === "History") {
                    emoji = '📚';
                } else if (route.name === "Settings") {
                    emoji = '⚙️';
                }

return (
  <View
    style={{
      backgroundColor: focused ? '#e0e0e0' : 'transparent',
      borderRadius: 20,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontSize: 24,
        textAlign: 'center',
      }}
    >
      {emoji}
    </Text>
  </View>
);
                },
            })}
            >
            <Tab.Screen
            name="Shopping"
            component={HomeStack}
            options={{
                    tabBarLabel: () => <Text style={{ fontSize: 12 }}>{i18n.t('shopping', { locale: language })}</Text>,
                    headerTitle: () => <Text style={{ fontSize: 16 }}>{i18n.t('shopping', { locale: language })}</Text>,
                }}
            />
            <Tab.Screen
            name="Lists"
            component={ListStack}
            options={{
                    tabBarLabel: () => <Text style={{ fontSize: 12 }}>{i18n.t('lists', { locale: language })}</Text>,
                    headerTitle: () => <Text style={{ fontSize: 16 }}>{i18n.t('lists', { locale: language })}</Text>,
                }}
            />
            <Tab.Screen
            name="Friends"
            component={Friends}
            options={{
                    tabBarLabel: () => <Text style={{ fontSize: 12 }}>{i18n.t('friends', { locale: language })}</Text>,
                    headerTitle: () => <Text style={{ fontSize: 16 }}>{i18n.t('friends', { locale: language })}</Text>,
                }}
            />
            <Tab.Screen
            name="History"
            component={History}
            options={{
                    tabBarLabel: () => <Text style={{ fontSize: 12 }}>{i18n.t('history', { locale: language })}</Text>,
                    headerTitle: () => <Text style={{ fontSize: 16 }}>{i18n.t('history', { locale: language })}</Text>,
                }}
            />
            <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
                    tabBarLabel: () => <Text style={{ fontSize: 12 }}>{i18n.t('settings', { locale: language })}</Text>,
                    headerTitle: () => <Text style={{ fontSize: 16 }}>{i18n.t('settings', { locale: language })}</Text>,
                }}
            />
        </Tab.Navigator>
    );

}

export default Tabs;