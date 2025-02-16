import { Text, SafeAreaView, Button } from 'react-native';
import React, { useState, useEffect} from 'react';
import apiInstance from '../../utils/axios';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const Lists = () => {

    const navigation = useNavigation();

    const [shoppingLists, setShoppingLists] = useState([]);

    const getAllLists = async () => {
        try {
          const response = await apiInstance.get('shopping_list/');
          console.log('All Shopping:', response.data);
          setShoppingLists(response.data);
        } catch (error) {
          console.error(error)
          console.error('Error fetching all list:', error.response ? error.response.data : error.message);
        }
      };

    useEffect(() => {
        getAllLists();
        }, [])

    useFocusEffect(
        React.useCallback(() => {
            getAllLists();
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
        <Text>Your Lists</Text>
        { lists }
        <Button title="Add New List" onPress={() => navigation.navigate(Routes.ShoppingListForm)} />
    </SafeAreaView>
  );
}

export default Lists;

//<SafeAreaView>
//<Text>Lists here</Text>
//{formDisplay && <ShoppingListForm updateLists={getLists} />}
//<Button title={formButtonTitle} onPress={() => toggleForm()} /> 
//</SafeAreaView>
//);