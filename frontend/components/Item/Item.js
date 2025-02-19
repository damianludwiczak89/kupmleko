import {  Text, View, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useState } from 'react';



const Item = ({name, amount, bought, active}) => {
    const [boughtState, setBought] = useState(bought);
    console.log('active', active)
    return (
        <View>
            <Text>{name}: {amount}
            {active ? (
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
            ) : null }
            </Text>
        </View>
    )

}

export default Item;