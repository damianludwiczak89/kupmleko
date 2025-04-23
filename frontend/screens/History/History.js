import React, { useState } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const History = () => {

    const [historyLists, setHistoryLists] = useState([]);

    const getHistoryLists = async () => {
        try {
          const response = await apiInstance.get('history/');
          console.log('History:', response.data);
          setHistoryLists(response.data);
        } catch (error) {
          console.error('error', error)
          console.error('Error fetching history:', error.response ? error.response.data : error.message);
          if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Status:', error.response.status);
          }
        }
      };

    useFocusEffect(
        React.useCallback(() => {
            getHistoryLists();
        }, [])
        );

        const lists = historyLists.map((list) => (
            <ShoppingList
              key={list.id}
              id={list.id}
              name={list.name}
              items={list.items}
              history={true}
            />
          ));
    

  return (
    <SafeAreaView>
        <ScrollView>
            { lists }
        </ScrollView>
    </SafeAreaView>
  );
}

export default History;