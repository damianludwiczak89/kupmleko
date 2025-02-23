import Item from '../Item/Item';
import {  Button, View } from 'react-native';
import { useState } from 'react';
import apiInstance from '../../utils/axios';

const ShoppingList = ({ id, name, items, active, update }) => {

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
            await apiInstance.put(`draft/${id}/`)
        }
        catch (error) {
            console.log('error activating list')
        }
    }
    items = items.map((item) => (
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
                    {items}
                    {!active && <Button title="Activate" onPress={() => activate(id)} />}
                    <Button title={active ? "Completed" : "Delete"} onPress={() => deleteList(id)} />
                </View>
            )}

        </View>
    )
}

export default ShoppingList;