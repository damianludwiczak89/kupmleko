import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      scrollContent: {
        padding: 20,
        paddingBottom: 100,
        backgroundColor: '#fff8b3', 
        padding: 16,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        marginBottom: 10,
      },
      bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
      },
      itemInput: {
        flex: 1,
        borderWidth: 1,
        padding: 8,
        borderRadius: 4,
        marginRight: 5,
      },
      stepperText: {
        fontSize: 20,
        paddingHorizontal: 6,
      },
      smallStepperText: {
        fontSize: 6,
        paddingHorizontal: 6,
      },
      amountInput: {
        width: 50,
        borderWidth: 1,
        borderRadius: 4,
        textAlign: 'center',
        marginHorizontal: 5,
        padding: 5,
      },
      checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      },
      checkboxText: {
        marginLeft: 8,
      },
      saveButton: {
        marginTop: 20,
      },
      itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      },
      itemText: {
        fontSize: 16,
      },
      deleteText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 18,
        paddingHorizontal: 10,
      },
      itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
      },
      
      itemName: {
        flex: 1,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: '#fff8b3',
        minWidth: 100,
      },
      
      amountSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
      },
      
      amountText: {
        marginHorizontal: 8,
        fontSize: 16,
      },
      
      smallStepperText: {
        fontSize: 18,
        paddingHorizontal: 6,
      },
      
      deleteText: {
        fontSize: 18,
        paddingHorizontal: 10,
      },
      
});

export default styles;