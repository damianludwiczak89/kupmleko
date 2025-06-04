import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    backgroundColor: '#fff8b3',
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
  languageButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },

  languageButtonSelected: {
    borderColor: '#841584',
    backgroundColor: '#f2e6f9',
  },

  languageEmoji: {
    fontSize: 30,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff8b3',
  },
});

export default styles;
