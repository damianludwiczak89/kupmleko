import { useEffect, useState } from 'react';
import {  SafeAreaView, Text, View } from 'react-native';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import ShoppingListForm from '../../components/ShoppingListForm/ShoppingListForm';

// Deal with error messages on invalid register
// Token refresh - try using useAxios??
// ScrollView
// Hide elements
// Remove item from form on click

const Home = () => {

    const navigation = useNavigation();

    const [shoppingLists, setShoppingLists] = useState([])

    useEffect(() => {
      const getLists = async () => {
          try {
            const response = await apiInstance.get('shopping_list/');
            console.log('Shopping:', response.data);
            setShoppingLists(response.data);
          } catch (error) {
            console.error('Error fetching list:', error.response ? error.response.data : error.message);
            navigation.navigate(Routes.Login)
          }
        };
        getLists();
        }, [])

    const lists = shoppingLists.map((list) => (
      <ShoppingList
        key={list.id}
        name={list.name}
        items={list.items} />
    ));

    return (
        <SafeAreaView>
            <Text>Shopping List</Text>
            <ShoppingListForm />
              { lists }
        </SafeAreaView>
    );
};

export default Home;