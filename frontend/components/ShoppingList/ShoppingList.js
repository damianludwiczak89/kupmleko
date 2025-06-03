import Item from '../Item/Item';
import {  View, Pressable, Text } from 'react-native';
import { useState } from 'react';
import apiInstance from '../../utils/axios';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';
import styles from './styles';
import { useRefreshStore } from '../../store/auth';
import { Alert } from 'react-native';
import i18n from '../../i18n';
import { useAuthStore } from '../../store/auth';

const ShoppingList = ({ id, name, creator = null, items, active=true, update, history=false, timestamp=false }) => {

    const language = useAuthStore((state) => state.language);

    const triggerHistoryRefresh = useRefreshStore(state => state.triggerHistoryRefresh);
    const triggerShoppingListsRefresh = useRefreshStore(state => state.triggerShoppingListsRefresh);

    const allUserData = useAuthStore((state) => state.allUserData)

    const navigation = useNavigation();

    const [displayList, setDisplayList] = useState(false)

    const deleteList = async (id) => {
        const endpoint = active ? "shopping_list" : "draft";
        try {
            await apiInstance.delete(`${endpoint}/${id}/`)
            triggerHistoryRefresh();
            update();
            Alert.alert(i18n.t('listCompleted',  { locale: language }))
        }
        catch (error) {
            console.log('error deleting list')
        }
    }

    const activate = async (id) => {
        try {
            await apiInstance.post('draft/activate/', {id: id})
            triggerShoppingListsRefresh();
            Alert.alert(i18n.t('listActivated',  { locale: language }));
        }
        catch (error) {
            Alert.alert(i18n.t('error',  { locale: language }));
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
                <View style={styles.headerLeft}>
                    <View>
                    <Text style={styles.cardHeaderText}>{name}</Text>
                    {creator && creator !== allUserData?.username && (
                        <Text style={styles.subText}>{creator}</Text>
                    )}
                    {history && <Text style={styles.subText}>{timestamp}</Text>}
                    </View>
                </View>
                <Text style={styles.expandIcon}>{displayList ? "➖" : "➕"}</Text>
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