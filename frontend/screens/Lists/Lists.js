import { Text, SafeAreaView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect} from 'react';
import apiInstance from '../../utils/axios';
import { Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { useRefreshStore } from '../../store/auth';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import styles from './styles';
import screenStyle from '../screenStyle';
import i18n from '../../i18n';
import { useAuthStore } from '../../store/auth';

const Lists = () => {

    const language = useAuthStore((state) => state.language);

    const [loading, setLoading] = useState(true);

    const draftsToken = useRefreshStore(state => state.draftsToken);

    const navigation = useNavigation();

    const [drafts, setDrafts] = useState([]);

    const getDrafts = async () => {
        try {
          const response = await apiInstance.get('draft/');
          console.log('Drafts:', response.data);
          setDrafts(response.data);
          setLoading(false)
        } catch (error) {
          console.error(error)
          console.error('Error fetching drafts:', error.response ? error.response.data : error.message);
        }
      };

  useEffect(() => {
          getDrafts();
      }, [draftsToken])

    const lists = drafts.map((list) => (
            <ShoppingList
              id={list.id}
              key={list.id}
              name={list.name}
              items={list.items}
              active={false}
              update={getDrafts} />
          ));

  if (loading) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
          </View>
      );
  }

  return (
    <View style={styles.fullscreen}>
      <SafeAreaView style={styles.container}>
          {lists && lists.length > 0 ? (
              lists
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                {i18n.t('noLists', { locale: language })}
              </Text>
          )}
          <View style={screenStyle.iconWrapper}>
          
            <TouchableOpacity onPress={() => navigation.navigate(Routes.ShoppingListForm)} style={screenStyle.iconButton}>
              <FontAwesomeIcon icon={faCirclePlus} style={screenStyle.icon} size={40} />
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    </View>
  );
}

export default Lists;