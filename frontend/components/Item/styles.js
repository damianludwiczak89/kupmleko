import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0', // light grey line
      },
      
      itemText: {
        fontSize: 16,
        color: '#333',
      },
      
      checkboxTouchable: {
        marginLeft: 10,
      },
    })

export default styles;