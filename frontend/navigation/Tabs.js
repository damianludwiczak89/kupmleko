import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Friends from '../screens/Friends/Friends';
import History from '../screens/History/History';
import Settings from '../screens/Settings/Settings';
import {HomeStack, ListStack} from './ScreenStack';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBasketShopping, faUser} from "@fortawesome/free-solid-svg-icons";
import {faBook} from "@fortawesome/free-solid-svg-icons";
import {faClipboard} from "@fortawesome/free-solid-svg-icons";
import {faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {faGear} from "@fortawesome/free-solid-svg-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let icon;

                if (route.name === 'Shopping') {
                    icon = faBasketShopping;
                } else if (route.name === 'List') {
                    icon = faClipboard;
                } else if (route.name === "Friends") {
                    icon = faUserGroup;
                } else if (route.name === "History") {
                    icon = faBook;
                } else if (route.name === "Settings") {
                    icon = faGear;
                }

                return (
                    <FontAwesomeIcon
                    icon={icon}
                    size={focused ? 32 : 28}
                    color={focused ? 'dodgerblue' : 'gray'}
                    style={{
                      shadowColor: 'dodgerblue',
                      shadowOffset: { width: 0, height: focused ? 5 : 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 5,
                      elevation: focused ? 10 : 0,
                    }}
                  />
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