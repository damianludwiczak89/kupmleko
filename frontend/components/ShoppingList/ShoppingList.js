import Item from '../Item/Item';
import {  Text, View } from 'react-native';


const ShoppingList = ({ name, items }) => {
    console.log(items)
    items = items.map((item) => (
        <Item
            key={item.id}
            name={item.name}
            amount={item.amount}
            bought={item.bought}
        />
    ))
    return (
        <View>
            <Text>{name}</Text>
                {items}
        </View>
    )
}

export default ShoppingList;