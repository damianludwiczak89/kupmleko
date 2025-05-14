import Item from '../Item/Item';
import {  Button, View, Pressable, Text } from 'react-native';
import { useState } from 'react';
import apiInstance from '../../utils/axios';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';
import styles from './styles';
import { useRefreshStore } from '../../store/auth';
import { Alert } from 'react-native';
import i18n from '../../i18n';
import { useAuthStore } from '../../store/auth';

const ShoppingList = ({ id, name, items, active=true, update, history=false, timestamp=false }) => {

    const language = useAuthStore((state) => state.language);

    const triggerHistoryRefresh = useRefreshStore(state => state.triggerHistoryRefresh);
    const triggerShoppingListsRefresh = useRefreshStore(state => state.triggerShoppingListsRefresh);

    const navigation = useNavigation();

    const [displayList, setDisplayList] = useState(false)

    const deleteList = async (id) => {
        const endpoint = active ? "shopping_list" : "draft";
        try {
            await apiInstance.delete(`${endpoint}/${id}/`)
            triggerHistoryRefresh();
            update();
        }
        catch (error) {
            console.log('error deleting list')
        }
    }

    const activate = async (id) => {
        try {
            await apiInstance.post('draft/activate/', {id: id})
            triggerShoppingListsRefresh();
            Alert.alert('List activated');
        }
        catch (error) {
            console.log('error activating list')
        }
    }

    const edit = (id, name, items) => {
        navigation.navigate(Routes.ShoppingListForm, { id, name, items, active });
    };

    itemComponents = items.map((item) => (
        <Item
            key={item.id}
            itemId={item.id}
            name={item.name}
            amount={item.amount}
            bought={item.bought}
            active={active}
            history={history}
        />
    ))



    return (
        <View style={styles.card}>
        <Pressable onPress={() => setDisplayList(!displayList)} style={styles.cardHeader}>
            <View>
                <Text style={styles.cardHeaderText}>{name}</Text>
                {history && <Text style={styles.timestampText}>{timestamp}</Text>}
            </View>
        </Pressable>

        {displayList && (
            <View style={styles.cardContent}>
            {itemComponents}

            {!history && (
                <View style={styles.buttonRow}>
                    {!active && (
                    <Pressable style={styles.customButton} onPress={() => activate(id)}>
                        <Text style={styles.customButtonText}>🛒 {i18n.t('activate',  { locale: language })}</Text>
                    </Pressable>
                    )}
                    <Pressable style={styles.customButton} onPress={() => deleteList(id)}>
                    <Text style={styles.customButtonText}>
                        {active 
                            ? `✅ ${i18n.t('complete', { locale: language })}`  
                            : `❌ ${i18n.t('delete', { locale: language })}`}
                    </Text>
                    </Pressable>
                    <Pressable style={styles.customButton} onPress={() => edit(id, name, items, active)}>
                    <Text style={styles.customButtonText}>✏️ {i18n.t('edit',  { locale: language })}</Text>
                    </Pressable>
                </View>
            )}
            </View>
        )}
        </View>
    )
}

export default ShoppingList;