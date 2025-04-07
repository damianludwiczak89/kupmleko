import React, { useState, useEffect } from 'react';
import {  SafeAreaView, Text, View, Button } from 'react-native';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthStore } from '../../store/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';
import { useRefreshStore } from '../../store/auth';


// Make the list adding more friendly, route after adding list, checkbox for active/draft
// Shoppinglistform - data validation, error messages
// Start friends - look up, add
// Consider refresh button instead of focus effect to lower traffic (then change focus to normal effect on render)
// Consider deleting search user api, invite directly

const Home = () => {

  const refreshToken = useRefreshStore(state => state.refreshToken);
  console.log('refreshToken value:', refreshToken);

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
      }, [refreshToken])

  const lists = shoppingLists.map((list) => (
    <ShoppingList
      key={list.id}
      id={list.id}
      name={list.name}
      items={list.items}
      active={true}
      update={getShoppingLists} />

  ));

  return (
      <SafeAreaView>
        <ScrollView>
          <Text>Active Lists</Text>
            { lists }
            <Button title="Add New List" onPress={() => navigation.navigate(Routes.ShoppingListForm)} />
        </ScrollView>
      </SafeAreaView>
  );
};

export default Home;