import { StyleSheet } from "react-native";

const screenStyle = StyleSheet.create({
    addIcon: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 30,
        padding: 15,
        zIndex: 999,
        elevation: 50,
      },
      refreshIcon: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        borderRadius: 30,
        padding: 15,
        zIndex: 999,
        elevation: 50,
      },
    icon: {
        color: '#007AFF',
    }
})

export default screenStyle;