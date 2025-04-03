import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Friends from '../screens/Friends/Friends';
import History from '../screens/History/History';
import {HomeStack, ListStack} from './ScreenStack';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="List" component={ListStack} />
            <Tab.Screen name="Friends" component={Friends} />
            <Tab.Screen name="History" component={History} />
        </Tab.Navigator>
    );

}

export default Tabs;