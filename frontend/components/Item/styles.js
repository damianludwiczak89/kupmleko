import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
      nameContainer: {
        flex: 1,
      },
      itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      },
      itemNameText: {
        fontSize: 16,
      },
      amountContainer: {
        width: 70, // Fixed width to align all amounts
        alignItems: 'flex-end',
      },
      
      itemText: {
        fontSize: 16,
        color: '#333',
      },
      
      checkboxTouchable: {
        marginLeft: 10,
      },

      amountText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
    })

export default styles;