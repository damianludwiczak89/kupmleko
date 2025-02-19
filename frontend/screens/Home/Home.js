import React, { useState, useEffect } from 'react';
import {  SafeAreaView, Text, View, Button } from 'react-native';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { logout } from '../../utils/auth';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthStore } from '../../store/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';


// in Home - mark as completed, in Lists - option to activate list
// Make the list adding more friendly, route after adding list, checkbox for active/draft
// Checkbox - mark/unmark as bought
// Remove ShoppingListForm component? 
// Shoppinglistform - data validation, error messages
// Add a prop to shopping list - if draft is using the component, do now show bought value

const Home = () => {

  const navigation = useNavigation();

  const allUserData = useAuthStore((state) => state.allUserData);

  console.log('alluserdata in home:', allUserData)

  const [shoppingLists, setShoppingLists] = useState([])

  const getShoppingLists = async () => {
    try {
      const response = await apiInstance.get('shopping_list/');
      console.log('Active Shopping:', response.data);
      setShoppingLists(response.data);
    } catch (error) {
      console.error('error', error)
      console.error('Error fetching shopping list:', error.response ? error.response.data : error.message);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Status:', error.response.status);
      }
    }
  };

  useEffect(() => {
      getShoppingLists();
      }, [])

  useFocusEffect(
      React.useCallback(() => {
          getShoppingLists();
      }, [])
    );

  const lists = shoppingLists.map((list) => (
    <ShoppingList
      key={list.id}
      name={list.name}
      items={list.items}
      active={true} />
  ));

  return (
      <SafeAreaView>
        <ScrollView>
          <Text>Active Lists</Text>
            { lists }
            <Button title="Add New List" onPress={() => navigation.navigate(Routes.ShoppingListForm)} />
            <Button title="Logout" onPress={async () => {
              await logout(); 
            }} />
        </ScrollView>
      </SafeAreaView>
  );
};

export default Home;