import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10,
      },
      
      customButton: {
        flex: 1,
        height: 40,
        backgroundColor: '#007AFF',
        marginHorizontal: 5,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      
      customButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
      }, 
      card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        margin: 10
      },
      
      cardHeader: {
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
      },
      
      cardHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
      },
      
      cardContent: {
        marginTop: 10,
      },
      
      

})

export default styles;