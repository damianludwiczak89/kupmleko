import {  Text, View, Checkbox } from 'react-native';
import CheckBox from '@react-native-community/checkbox';



const Item = ({name, amount, bought}) => {
    return (
        <View>
            <Text>{name}: {amount}
            <CheckBox
                value={bought}
            />
                
            </Text>
        </View>
    )

}

export default Item;