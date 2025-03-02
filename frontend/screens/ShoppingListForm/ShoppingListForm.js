import {  TextInput, View, Button, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';
import { Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

// Consider what to do with active/draft checkboxes if editing existing list
// probably add a prop to check if editing and hide them
// -- also need to edit a draft

const ShoppingListForm = (existingValues) => {

    const navigation = useNavigation();

    const [name, setName] = useState('')
    const [items, setItems] = useState([]);

    const [newItem, setNewItem] = useState('')
    const [newAmount, setNewAmount] = useState(1)

    const[activeBox, setActiveBox] = useState(true)
    const[draftBox, setDraftBox] = useState(false)
    console.log(existingValues.route.params.active)
    // If user is editing an existing list, populate fields with existing data
    useEffect(() => {
        if (existingValues?.route?.params?.name) {
            setName(existingValues.route.params.name);
            existingValues.route.params.items.map((item) => {
                console.log(item)
                setItems(prevItems => [
                    ...prevItems,
                    { id: prevItems.length + 1, name: item['name'], amount: item['amount'], bought: item['bought'] }])
            })
        }
    }, [existingValues]);

    const addItem = () => {
        setItems(prevItems => [
        ...prevItems,
        { id: prevItems.length + 1, name: newItem, amount: newAmount, bought: false }])
        setNewItem('')
        setNewAmount(1)
    }

    const removeItem = (id) => {
        console.log('remove id', id)
        setItems(items.filter(item => item.id != id))
    }

    const saveList = async (name, items, endpoint, activeAndDraft=false) => {
        // if edit
        if (existingValues?.route?.params?.id) {
            existingValues.route.params.active === true ? endpoint = "shopping_list/" : endpoint = "draft/"
            try {
                const id = existingValues?.route?.params?.id
                console.log(endpoint)
                const {data} = await apiInstance.put(`${endpoint}${id}/`, {
                    name,
                    items,
                });
                console.log('changed')
                return {data, error: null}
            } catch (error) {
                return {
                    data: null,
                    error: error.response.data?.detail || "Something went wrong",
                };
            }}
        // if adding new
        try {
            const {data} = await apiInstance.post(`${endpoint}`, {
                name,
                items,
                activeAndDraft,
            });
            console.log('added', endpoint)
            return {data, error: null}
        } catch (error) {
            return {
                data: null,
                error: error.response.data?.detail || "Something went wrong",
            };
    }    
    };

    const handleSave = (name, items) => {
        // TODO add input validation
        if (activeBox && draftBox) {
            saveList(name, items, 'draft/', true);

        }
        else if (draftBox) {
            saveList(name, items, 'draft/');
        }
        else {
            saveList(name, items, 'shopping_list/');
        }

        setName('');
        setItems([]);
        setNewItem('');
        setNewAmount(1);
        Alert.alert('List saved');
        setTimeout(() => {
            navigation.goBack();
        }, 1000);
    }

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
                    value={newAmount.toString()}
                    inputMode="numeric"
                    onChangeText={(text) => setNewAmount(Number(text) || 1)}
                    placeholder='Amount'
                />
            <Button title="Add item" onPress={() => addItem()} />
            {!existingValues?.route?.params?.id && (
            <>
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
                </View></>
            )}
            
            
            <Button title="Save List" onPress={() => handleSave( name, items )} />
        </View>
    )

}

export default ShoppingListForm;