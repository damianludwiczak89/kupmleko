import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';
import { Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { useRefreshStore } from '../../store/auth';
import styles from './styles';
import uuid from 'react-native-uuid';
import i18n from '../../i18n';
import { useAuthStore } from '../../store/auth';

// Consider what to do with active/draft checkboxes if editing existing list
// probably add a prop to check if editing and hide them
// -- also need to edit a draft

const ShoppingListForm = (existingValues) => {

    const language = useAuthStore((state) => state.language);

    const triggerDraftsRefresh = useRefreshStore(state => state.triggerDraftsRefresh);
    const triggerShoppingListsRefresh = useRefreshStore(state => state.triggerShoppingListsRefresh);

    const navigation = useNavigation();

    const [name, setName] = useState('')
    const [items, setItems] = useState([]);

    const [newItem, setNewItem] = useState('')
    const [newAmount, setNewAmount] = useState(1)

    const[activeBox, setActiveBox] = useState(true)
    const[draftBox, setDraftBox] = useState(false)
    // If user is editing an existing list, populate fields with existing data
    useEffect(() => {
        if (existingValues?.route?.params?.name) {
            setName(existingValues.route.params.name);
            existingValues.route.params.items.map((item) => {
                console.log(item)
                setItems(prevItems => [
                    ...prevItems,
                    { id: uuid.v4(), name: item['name'], amount: item['amount'], bought: item['bought'] }])
            })
        }
    }, [existingValues]);

    const addItem = () => {
        setItems(prevItems => [
        ...prevItems,
        { id: uuid.v4(), name: newItem, amount: newAmount, bought: false }])
        setNewItem('')
        setNewAmount(1)
        console.log(items)
    }

    const incrementAmount = (id) => {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id
            ? { ...item, amount: item.amount + 1 }
            : item
        )
      );
    };

    const decrementAmount = (id) => {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id
            ? { ...item, amount: item.amount - 1 }
            : item
        )
      );
    };

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
        Alert.alert(i18n.t('listSaved', { locale: language }));
        
        // this double timeout makes sure that previous screen is mounted, and current data fetched
        setTimeout(() => {
            navigation.goBack();
            setTimeout(() => {
                triggerDraftsRefresh();
                triggerShoppingListsRefresh();
            }, 300);
          }, 1000);
    }

  const handleItemEdit = (id, newName) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, name: newName}
          : item
      )
    );
  }

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={i18n.t('listName', { locale: language })}
            maxLength={25}
            autoFocus
          />
    
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
                <TextInput style={styles.itemName}
                  value={item.name}
                  onChangeText={(newName) => handleItemEdit(item.id, newName)}
                  maxLength={25}
                />

              <View style={styles.amountSection}>
                <TouchableOpacity onPress={() => decrementAmount(item.id)}>
                  <Text style={styles.smallStepperText}>➖</Text>
                </TouchableOpacity>
                
                <Text style={styles.amountText}>{item.amount}</Text>
                
                <TouchableOpacity onPress={() => incrementAmount(item.id)}>
                  <Text style={styles.smallStepperText}>➕</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Text style={styles.deleteText}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))}
    
          {!existingValues?.route?.params?.id && (
            <>
              <View style={styles.checkboxRow}>
                <TouchableOpacity onPress={() => setActiveBox(!activeBox)} style={styles.checkboxRow}>
                  <CheckBox
                    value={activeBox}
                    disabled={true}
                    tintColors={{ true: 'blue', false: 'gray' }}
                  />
                  <Text style={styles.checkboxText}>{i18n.t('addToShopping', { locale: language })}</Text>
                </TouchableOpacity>
              </View>
    
              <View style={styles.checkboxRow}>
                <TouchableOpacity onPress={() => setDraftBox(!draftBox)} style={styles.checkboxRow}>
                  <CheckBox
                    value={draftBox}
                    disabled={true}
                    tintColors={{ true: 'blue', false: 'gray' }}
                  />
                  <Text style={styles.checkboxText}>{i18n.t('addToDrafts', { locale: language })}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
    
          <View style={styles.saveButton}>
            <Button 
                title={i18n.t('save', { locale: language })}
                disabled={!(name && items.length > 0 && (activeBox || draftBox))}
                onPress={() => handleSave(name, items)} />
          </View>
        </ScrollView>
    
        <View style={styles.bottomBar}>
          <TextInput
            style={styles.itemInput}
            value={newItem}
            onChangeText={setNewItem}
            placeholder={i18n.t('item', { locale: language })}
            maxLength={25}
          />
          <TouchableOpacity onPress={() => setNewAmount(Math.max(1, newAmount - 1))}>
            <Text style={styles.stepperText}>➖</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.amountInput}
            value={newAmount.toString()}
            inputMode="numeric"
            onChangeText={text => setNewAmount(Number(text))}
          />
          <TouchableOpacity onPress={() => setNewAmount(newAmount + 1)}>
            <Text style={styles.stepperText}>➕</Text>
          </TouchableOpacity>
          <Button 
            title={i18n.t('add', { locale: language })} 
            onPress={addItem} 
            disabled={newItem ? false : true} />
        </View>
      </View>
    )
    };


export default ShoppingListForm;