import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Friends from '../screens/Friends/Friends';
import History from '../screens/History/History';
import Settings from '../screens/Settings/Settings';
import {HomeStack, ListStack} from './ScreenStack';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faB, faBasketShopping} from "@fortawesome/free-solid-svg-icons";
import {faBook} from "@fortawesome/free-solid-svg-icons";
import {faClipboard} from "@fortawesome/free-solid-svg-icons";
import {faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {faGear} from "@fortawesome/free-solid-svg-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
            name="Shopping"
            component={HomeStack}
            options={{
                tabBarIcon: () => (
                <FontAwesomeIcon icon={faBasketShopping} size={28}/>
                ),
            }}
            />
            <Tab.Screen
            name="List"
            component={ListStack}
            options={{
                tabBarIcon: () => (
                <FontAwesomeIcon icon={faClipboard} size={28}/>
                ),
            }}
            />
            <Tab.Screen
            name="Friends"
            component={Friends}
            options={{
                tabBarIcon: () => (
                <FontAwesomeIcon icon={faUserGroup} size={28}/>
                ),
            }}
            />
            <Tab.Screen
            name="History"
            component={History}
            options={{
                tabBarIcon: () => (
                <FontAwesomeIcon icon={faBook} size={28}/>
                ),
            }}
            />
            <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
                tabBarIcon: () => (
                <FontAwesomeIcon icon={faGear} size={28}/>
                ),
            }}
            />
        </Tab.Navigator>
    );

}

export default Tabs;