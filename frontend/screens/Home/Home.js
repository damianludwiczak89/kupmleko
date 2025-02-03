import { useEffect, useState } from 'react';
import {  SafeAreaView, Text, View, Button } from 'react-native';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import ShoppingListForm from '../../components/ShoppingListForm/ShoppingListForm';
import { logout } from '../../utils/auth';

// ScrollView
// Update List
// Check logging out from Home

const Home = () => {

    const navigation = useNavigation();

    const [formDisplay, setFormDisplay] = useState(false)
    const [formButtonTitle, setFormButtonTitle] = useState('Add New List')

    const toggleForm = () => {
      formDisplay === false ? setFormButtonTitle("Hide") : setFormButtonTitle("Add New List")
      setFormDisplay(!formDisplay)
    }

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
            {formDisplay && <ShoppingListForm />}
            <Button title={formButtonTitle} onPress={() => toggleForm()} />
              { lists }
              <Button title="Logout" onPress={async () => {
                await logout(); 
                navigation.navigate(Routes.Login);
              }} />
        </SafeAreaView>
    );
};

export default Home;