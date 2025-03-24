import Item from '../Item/Item';
import {  Button, View } from 'react-native';
import { useState } from 'react';
import apiInstance from '../../utils/axios';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';

const ShoppingList = ({ id, name, items, active, update }) => {

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
        />
    ))



    return (
        <View>
            <Button title={name} onPress={() => setDisplayList(!displayList)} />
            {displayList && (
                <View>
                    {itemComponents}
                    {!active && <Button title="Activate" onPress={() => activate(id)} />}
                    <Button title={active ? "Completed" : "Delete"} onPress={() => deleteList(id)} />
                    <Button title="Edit" onPress={() => edit(id, name, items, active)} />
                </View>
            )}

        </View>
    )
}

export default ShoppingList;