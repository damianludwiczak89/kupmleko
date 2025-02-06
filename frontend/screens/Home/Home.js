import { useEffect, useState } from 'react';
import {  SafeAreaView, Text, View, Button } from 'react-native';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import ShoppingListForm from '../../components/ShoppingListForm/ShoppingListForm';
import { logout } from '../../utils/auth';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthStore } from '../../store/auth';

// ScrollView
// Update List

const Home = () => {

    const navigation = useNavigation();

    const [formDisplay, setFormDisplay] = useState(false)
    const [formButtonTitle, setFormButtonTitle] = useState('Add New List')

    const toggleForm = () => {
      formDisplay === false ? setFormButtonTitle("Hide") : setFormButtonTitle("Add New List")
      setFormDisplay(!formDisplay)
    }

    const [shoppingLists, setShoppingLists] = useState([])

    const getLists = async () => {
      try {
        const response = await apiInstance.get('shopping_list/');
        console.log('Shopping:', response.data);
        setShoppingLists(response.data);
      } catch (error) {
        console.error('Error fetching list:', error.response ? error.response.data : error.message);
      }
    };

    useEffect(() => {
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
          <ScrollView>
            <Text>Shopping List</Text>
            {formDisplay && <ShoppingListForm updateLists={getLists} />}
            <Button title={formButtonTitle} onPress={() => toggleForm()} />
              { lists }
              <Button title="Logout" onPress={async () => {
                await logout(); 
              }} />
          </ScrollView>
        </SafeAreaView>
    );
};

export default Home;