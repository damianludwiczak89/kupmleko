import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  stickyCard: {
    backgroundColor: '#fff9c4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontStyle: 'italic',
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
  },
  icon: {
    marginHorizontal: 4,
  },
  emoji: {
    fontSize: 24,
  },
});

export default styles;
