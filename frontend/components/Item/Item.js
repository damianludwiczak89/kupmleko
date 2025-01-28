import {  Text, View, Checkbox } from 'react-native';



const Item = ({name, amount, bought}) => {
    console.log(bought)
    return (
        <View>
            <Text>{name}: {amount}
                
                
            </Text>
        </View>
    )

}

export default Item;