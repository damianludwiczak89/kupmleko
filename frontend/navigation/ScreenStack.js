import { createStackNavigator } from '@react-navigation/stack';
import Lists from '../screens/Lists/Lists'
import Home from '../screens/Home/Home'
import ShoppingListForm from '../screens/ShoppingListForm/ShoppingListForm'

const Stack = createStackNavigator();

export const ListStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Lists" component={Lists} />
            <Stack.Screen name="ShoppingListForm" component={ShoppingListForm} />
        </Stack.Navigator>
    )
}

export const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Active" component={Home} />
            <Stack.Screen name="ShoppingListForm" component={ShoppingListForm} />
        </Stack.Navigator>
    )
}