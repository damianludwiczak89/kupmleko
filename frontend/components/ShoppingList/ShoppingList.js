import Item from '../Item/Item';
import {  Button, View, Pressable, Text } from 'react-native';
import { useState } from 'react';
import apiInstance from '../../utils/axios';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';
import styles from './styles';
import { useRefreshStore } from '../../store/auth';
import { Alert } from 'react-native';

const ShoppingList = ({ id, name, items, active=true, update, history=false, timestamp=false }) => {

    const triggerRefresh = useRefreshStore(state => state.triggerRefresh);

    const navigation = useNavigation();

    const [displayList, setDisplayList] = useState(false)

    const [completed, setCompleted] = useState(false);

    const handleCheckboxChange = () => {
        setCompleted(!completed)
    }

    const deleteList = async (id) => {
        const endpoint = active ? "shopping_list" : "draft";
        try {
            await apiInstance.delete(`${endpoint}/${id}/`)
            update();
        }
        catch (error) {
            console.log('error deleting list')
        }
    }

    const activate = async (id) => {
        try {
            await apiInstance.post('draft/activate/', {id: id})
            triggerRefresh();
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
                        <Text style={styles.customButtonText}>🛒 Activate</Text>
                    </Pressable>
                    )}
                    <Pressable style={styles.customButton} onPress={() => deleteList(id)}>
                    <Text style={styles.customButtonText}>{active ? '✅ Completed' : '❌ Delete'}</Text>
                    </Pressable>
                    <Pressable style={styles.customButton} onPress={() => edit(id, name, items, active)}>
                    <Text style={styles.customButtonText}>✏️ Edit</Text>
                    </Pressable>
                </View>
            )}
            </View>
        )}
        </View>
    )
}

export default ShoppingList;