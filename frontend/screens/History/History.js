import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, SafeAreaView, ActivityIndicator, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import apiInstance from '../../utils/axios';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { useAuthStore } from '../../store/auth';
import i18n from '../../i18n';

const History = () => {

    const language = useAuthStore((state) => state.language);
    const [loading, setLoading] = useState(true);

    const [historyLists, setHistoryLists] = useState([]);

    const getHistoryLists = async () => {
        try {
          const response = await apiInstance.get('history/');
          console.log('History:', response.data);
          setHistoryLists(response.data);
          setLoading(false)
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
              timestamp={list.archived_timestamp}
            />
          ));

  if (loading) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
          </View>
      );
  }
    

  return (
    <SafeAreaView>
        <ScrollView>
          {lists && lists.length > 0 ? (
              lists
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                {i18n.t('noHistory',  { locale: language })}
              </Text>
          )}
        </ScrollView>
    </SafeAreaView>
  );
}

export default History;