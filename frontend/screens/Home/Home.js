import React, { useState, useEffect, useCallback } from 'react';
import {  SafeAreaView, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
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
import i18n from '../../i18n';


const Home = () => {

  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);
  const [loading, setLoading] = useState(true);


  const shoppingListsToken = useRefreshStore(state => state.shoppingListsToken);
  console.log('listsToken value:', shoppingListsToken);

  const navigation = useNavigation();

  const allUserData = useAuthStore((state) => state.allUserData);


  useEffect(() => {
    if (allUserData?.language) {
      console.log('set language from', i18n.locale);
      setLanguage(allUserData.language);
      console.log('set language to', i18n.locale);
    }
  }, [allUserData?.language]);

  console.log('alluserdata in home:', allUserData)

  const [shoppingLists, setShoppingLists] = useState([])

  const getShoppingLists = async () => {
    try {
      const response = await apiInstance.get('shopping_list/');
      console.log('Active Shopping:', response.data);
      setShoppingLists(response.data);
      setLoading(false)
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


  if (loading) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
          </View>
      );
  }

  const lists = shoppingLists.map((list) => (
    <ShoppingList
      key={list.id}
      id={list.id}
      creator={list.created_by}
      name={list.name}
      items={list.items}
      active={true}
      update={getShoppingLists} />

  ));

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {lists && lists.length > 0 ? (
              lists
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                {i18n.t('noShopping', { locale: language })}
              </Text>
          )}
        </ScrollView>
      
  
      <View style={screenStyle.iconWrapper}>
        <TouchableOpacity onPress={() => navigation.replace('Active')} style={screenStyle.iconButton}>
          <FontAwesomeIcon icon={faArrowsRotate} style={screenStyle.icon} size={36} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate(Routes.ShoppingListForm)} style={screenStyle.iconButton}>
          <FontAwesomeIcon icon={faCirclePlus} style={screenStyle.icon} size={40} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Home;