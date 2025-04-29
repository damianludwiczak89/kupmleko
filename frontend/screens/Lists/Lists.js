import { Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect} from 'react';
import apiInstance from '../../utils/axios';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { useRefreshStore } from '../../store/auth';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import styles from './styles';
import screenStyle from '../screenStyle';

const Lists = () => {

    const refreshToken = useRefreshStore(state => state.refreshToken);

    const navigation = useNavigation();

    const [drafts, setDrafts] = useState([]);

    const getDrafts = async () => {
        try {
          const response = await apiInstance.get('draft/');
          console.log('Drafts:', response.data);
          setDrafts(response.data);
        } catch (error) {
          console.error(error)
          console.error('Error fetching drafts:', error.response ? error.response.data : error.message);
        }
      };

  useEffect(() => {
          getDrafts();
      }, [refreshToken])

    const lists = drafts.map((list) => (
            <ShoppingList
              id={list.id}
              key={list.id}
              name={list.name}
              items={list.items}
              active={false}
              update={getDrafts} />
          ));

  return (
    <View style={styles.fullscreen}>
      <SafeAreaView style={styles.container}>
          { lists }
          <View style={screenStyle.iconWrapper}>
            <TouchableOpacity onPress={() => triggerRefresh()} style={screenStyle.iconButton}>
              <FontAwesomeIcon icon={faArrowsRotate} style={screenStyle.icon} size={36} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate(Routes.ShoppingListForm)} style={screenStyle.iconButton}>
              <FontAwesomeIcon icon={faCirclePlus} style={screenStyle.icon} size={40} />
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    </View>
  );
}

export default Lists;

//<TouchableOpacity style={screenStyle.addIcon} onPress={() => navigation.navigate(Routes.ShoppingListForm)}>
//<FontAwesomeIcon icon={faCirclePlus} style={screenStyle.icon} size={48}/>
//</TouchableOpacity>