import {  Text, View, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useState } from 'react';



const Item = ({name, amount, bought}) => {
    const [boughtState, setBought] = useState(bought);
    return (
        <View>
            <Text>{name}: {amount}
            <View>
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setBought(!boughtState)}
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
                
            </Text>
        </View>
    )

}

export default Item;