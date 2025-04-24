import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      scrollContent: {
        padding: 20,
        paddingBottom: 100,
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
});

export default styles;