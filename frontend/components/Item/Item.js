import {  Text, View, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import apiInstance from '../../utils/axios';



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
        <View>
            <Text>{name}: {amount}
            {active ? (
                <View>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    disabled = {history}
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
                </View>
            ) : null }
            </Text>
        </View>
    )

}

export default Item;