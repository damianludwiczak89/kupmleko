import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import Lists from '../screens/Lists/Lists';
import Friends from '../screens/Friends/Friends';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Lists" component={Lists} />
            <Tab.Screen name="Friends" component={Friends} />
        </Tab.Navigator>
    );

}

export default Tabs;