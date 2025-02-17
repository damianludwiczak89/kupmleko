import {  TextInput, View, Button, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import apiInstance from '../../utils/axios';
import { Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const ShoppingListForm = () => {

    const [name, setName] = useState('')
    const [items, setItems] = useState([]);

    const [newItem, setNewItem] = useState('')
    const [newAmount, setNewAmount] = useState(1)

    const[activeBox, setActiveBox] = useState(true)
    const[draftBox, setDraftBox] = useState(false)

    const addItem = () => {
        setItems(prevItems => [
        ...prevItems,
        { id: prevItems.length + 1, name: newItem, amount: newAmount }])
        setNewItem('')
        setNewAmount(1)
    }

    const removeItem = (id) => {
        console.log('remove id', id)
        setItems(items.filter(item => item.id != id))
    }

    const saveList = async (name, items) => {
        console.log('save')
        try {
            const {data} = await apiInstance.post('shopping_list/', {
                name,
                items,
            });
            console.log('added')
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
            {items.map((item) => (
                <View key={item.id}>
                <Text>{item.name}: {item.amount}</Text>
                <Button title='Remove Item' onPress={() => removeItem(item.id)} />
                </View>
                
            ))}
                <TextInput
                    style={{borderWidth: 1, padding: 10, borderRadius: 4}}
                    value={newItem}
                    onChangeText={(text) => setNewItem(text)}
                    placeholder='Item'
                />
                <TextInput
                    style={{borderWidth: 1, padding: 10, borderRadius: 4}}
                    value={newAmount}
                    inputMode="numeric"
                    onChangeText={(text) => setNewAmount(text)}
                    placeholder='Amount'
                />
            <Button title="Add item" onPress={() => addItem( name, items )} />

            <View>
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setActiveBox(!activeBox)}
            >
                <CheckBox
                    value={activeBox}
                    onValueChange={null}
                    disabled={true}
                    tintColors={{ true: 'blue', false: 'gray' }}
                    onTintColor="blue"
                    onCheckColor="blue"
                />
                <Text style={{ marginLeft: 8 }}>Add to Active</Text>
            </TouchableOpacity>
            </View>

            <View>
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setDraftBox(!draftBox)}
            >
                <CheckBox
                    value={draftBox}
                    onValueChange={null}
                    disabled={true}
                    tintColors={{ true: 'blue', false: 'gray' }}
                    onTintColor="blue"
                    onCheckColor="blue"
                />
                <Text style={{ marginLeft: 8 }}>Add to Drafts</Text>
            </TouchableOpacity>
            </View>
            
            <Button title="Save List" onPress={() => saveList( name, items )} />
        </View>
    )

}

export default ShoppingListForm;