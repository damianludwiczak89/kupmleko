import {  Text, View, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import apiInstance from '../../utils/axios';
import styles from './styles';



const Item = ({itemId, name, amount, bought, active, history=false}) => {
    const [boughtState, setBoughtState] = useState(bought);

    const debouncedUpdate = useCallback(
        debounce(async (newValue, itemId) => {
            console.log('debounce')
            try {
                await apiInstance.put(`item/${itemId}/`, { bought: newValue });
            } catch (error) {
                console.error('Error updating item:', error);
                setBoughtState(!newValue); 
            }
        }, 500), []);

    const handleCheckboxChange = (newValue, itemId) => {
        setBoughtState(newValue);
        debouncedUpdate(newValue, itemId);
    };
    

    return (
        <View style={styles.itemRow}>
        <Text style={styles.itemText}>
            {name}: {amount}
        </Text>

        {active && (
            <TouchableOpacity
            style={styles.checkboxTouchable}
            disabled={history}
            onPress={() => handleCheckboxChange(!boughtState, itemId)}
            >
            <CheckBox
                value={boughtState}
                onValueChange={null}
                disabled={true}
                tintColors={{ true: 'blue', false: 'gray' }}
                onTintColor="blue"
                onCheckColor="blue"
            />
            </TouchableOpacity>
        )}
        </View>
    )

}

export default Item;