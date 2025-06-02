import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardContent: {
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  customButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 20,
    paddingLeft: 10,
  },
});

export default styles;
