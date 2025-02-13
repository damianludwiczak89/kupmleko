import { Text, SafeAreaView, Button } from 'react-native';
import ShoppingListForm from '../../components/ShoppingListForm/ShoppingListForm';
import { useState, useEffect} from 'react';
import apiInstance from '../../utils/axios';

const Lists = () => {

    const [shoppingLists, setShoppingLists] = useState([]);
    const [formDisplay, setFormDisplay] = useState(false);
    const [formButtonTitle, setFormButtonTitle] = useState('Add New List');

    const toggleForm = () => {
        formDisplay === false ? setFormButtonTitle("Hide") : setFormButtonTitle("Add New List");
        setFormDisplay(!formDisplay)
    }

    const getLists = async () => {
        try {
            const response = await apiInstance.get('shopping_list/');
            console.log('Shopping: ', response.data);
        } catch {error} {
            console.error('Error fetching list: ', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        getLists();
    }, [])

  return (
    <SafeAreaView>
        <Text>Lists here</Text>
        {formDisplay && <ShoppingListForm updateLists={getLists} />}
        <Button title={formButtonTitle} onPress={() => toggleForm()} /> 
    </SafeAreaView>
  );
}

export default Lists;