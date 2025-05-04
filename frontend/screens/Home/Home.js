import React, { useState, useEffect } from 'react';
import {  SafeAreaView, Text, View, Button, TouchableOpacity } from 'react-native';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthStore } from '../../store/auth';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';
import { useRefreshStore } from '../../store/auth';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import styles from './styles';
import screenStyle from '../screenStyle';


// Shoppinglistform - data validation, error messages

const Home = () => {

  const shoppingListsToken = useRefreshStore(state => state.shoppingListsToken);
  console.log('listsToken value:', shoppingListsToken);

  const triggerShoppingListsRefresh = useRefreshStore(state => state.triggerShoppingListsRefresh);

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
      }, [shoppingListsToken])


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
    <View style={styles.fullscreen}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {lists}
        </ScrollView>
      </SafeAreaView>
  
      <View style={screenStyle.iconWrapper}>
        <TouchableOpacity onPress={() => triggerShoppingListsRefresh()} style={screenStyle.iconButton}>
          <FontAwesomeIcon icon={faArrowsRotate} style={screenStyle.icon} size={36} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate(Routes.ShoppingListForm)} style={screenStyle.iconButton}>
          <FontAwesomeIcon icon={faCirclePlus} style={screenStyle.icon} size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Home;