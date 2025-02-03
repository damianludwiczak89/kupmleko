import {  TextInput, View, Button } from 'react-native';
import { useState } from 'react';
import apiInstance from '../../utils/axios';

const ShoppingListForm = () => {

    const [name, setName] = useState('')
    const [items, setItems] = useState([{ id: 1, name: '', amount: 1 }]);

    const removeItem = (id) => {
        console.log('remove id', id)
        setItems(items.filter(item => item.id != id))
    }

    const addItemField = () => {
        setItems([...items, { id: items.length + 1, name: '', amount: 1 }]);
      };

    const handleItemChange = (text, id) => {
        setItems(items.map(item => item.id === id ? { ...item, name: text } : item));
      };
    
      const handleAmountChange = (text, id) => {
        setItems(items.map(item => item.id === id ? { ...item, amount: text.replace(/[^0-9]/g, '') } : item)); 
      };

      const saveList = async (name, items) => {
        try {
            const {data} = await apiInstance.post('shopping_list/', {
                name,
                items,
            });
            Alert.alert("List added");
            return {data, error: null}
        } catch (error) {
            return {
                data: null,
                error: error.response.data?.detail || "Something went wrong",
            };
        }    
    };

    return (
        <View>
            <TextInput
                style={{borderWidth: 1, padding: 10, borderRadius: 4}}
                value={name}
                onChangeText={value => setName(value)}
                placeholder='Name'
                autoFocus={true}
            />
            {items.map((item, index) => (
                <View key={item.id}>
                <TextInput
                    style={{borderWidth: 1, padding: 10, borderRadius: 4}}
                    value={item.name}
                    onChangeText={(text) => handleItemChange(text, item.id)}
                    placeholder={`Item ${index + 1}`}
                />
                <TextInput
                    style={{borderWidth: 1, padding: 10, borderRadius: 4}}
                    value={item.amount}
                    inputMode="numeric"
                    onChangeText={(text) => handleAmountChange(text, item.id)}
                    placeholder='Amount'
                />
                <Button title='Remove Item' onPress={() => removeItem(item.id)} />
                </View>
                
            ))}
            <Button title="+ Item" onPress={addItemField} />
            <Button title="Save List" onPress={() => saveList( name, items )} />
        </View>
    )

}

export default ShoppingListForm;