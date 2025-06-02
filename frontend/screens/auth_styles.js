import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  buttonWrapper: {
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  resetSection: {
    marginTop: 20,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
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

  sectionHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
googleButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  padding: 10,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#ccc',
  justifyContent: 'center',
},

googleIcon: {
  width: 20,
  height: 20,
  marginRight: 10,
},

googleButtonText: {
  fontSize: 16,
  color: '#333',
  fontWeight: '500',
},
});

export default styles;