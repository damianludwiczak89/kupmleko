import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { useRefreshStore } from '../../store/auth';
import { useAuthStore } from '../../store/auth';
import i18n from '../../i18n';

const History = () => {

    const language = useAuthStore((state) => state.language);

    const historyToken = useRefreshStore((state) => state.historyToken);

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

      useEffect(() => {
        getHistoryLists();
      }, [historyToken]);

        const lists = historyLists.map((list) => (
            <ShoppingList
              key={list.id}
              id={list.id}
              name={list.name}
              items={list.items}
              history={true}
              timestamp={list.archived_timestamp}
            />
          ));
    

  return (
    <SafeAreaView>
        <ScrollView>
          {lists && lists.length > 0 ? (
              lists
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                You don't have any archived shopping lists yet
              </Text>
          )}
        </ScrollView>
    </SafeAreaView>
  );
}

export default History;