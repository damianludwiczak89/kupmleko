import React, { useState, useEffect } from 'react';
import {  SafeAreaView, Text, View, Button } from 'react-native';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { logout } from '../../utils/auth';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthStore } from '../../store/auth';
import { useFocusEffect } from '@react-navigation/native';

// Add active field to shopping list - display only active in Home and all in Lists
// in Home - mark as completed, in Lists - option to activate list
// Make the list adding more friendly 
// Checkbox - mark/unmark as bought

const Home = () => {

  const allUserData = useAuthStore((state) => state.allUserData);

  console.log('alluserdata in home:', allUserData)

  const [shoppingLists, setShoppingLists] = useState([])

  const getLists = async () => {
    try {
      const response = await apiInstance.get('shopping_list/');
      console.log('Shopping:', response.data);
      setShoppingLists(response.data);
    } catch (error) {
      console.error(error)
      console.error('Error fetching list:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
      getLists();
      }, [])

  useFocusEffect(
      React.useCallback(() => {
          getLists();
      }, [])
    );

  const lists = shoppingLists.map((list) => (
    <ShoppingList
      key={list.id}
      name={list.name}
      items={list.items} />
  ));

  return (
      <SafeAreaView>
        <ScrollView>
          <Text>Shopping List</Text>
            { lists }
            <Button title="Logout" onPress={async () => {
              await logout(); 
            }} />
        </ScrollView>
      </SafeAreaView>
  );
};

export default Home;