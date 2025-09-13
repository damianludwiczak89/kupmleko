import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      scrollContent: {
        backgroundColor: '#fff8b3', 
        padding: 2,
        paddingBottom: 100,
        borderRadius: 10,
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
        margin: 10,
      },
      bottomBar: {
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

      dragHandle: {
        paddingHorizontal: 8,
        paddingVertical: 6,
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
        marginRight: 60,
        marginLeft: 60,
        marginBottom: 20,
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
        fontSize: 18,
        marginHorizontal: 10,
        marginLeft: 20
      },

      
      itemName: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginHorizontal: 8,
        paddingVertical: 4,
      },
      
      amountSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
      },
      
      amountText: {
        marginHorizontal: 8,
        fontSize: 16,
      },
      
      smallStepperText: {
        fontSize: 18,
        marginHorizontal: 8,
      },
      
});

export default styles;