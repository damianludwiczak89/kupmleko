import { StyleSheet } from 'react-native';

const screenStyle = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    columnGap: 16,
  },
  iconButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    padding: 14,
    marginLeft: 10,
    elevation: 5,
  },
  icon: {
    color: '#007AFF',
  },
});


export default screenStyle;