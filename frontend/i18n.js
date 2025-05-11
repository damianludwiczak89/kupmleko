import i18n from 'i18n-js';
import en from './languages/en';
import pl from './languages/pl';

i18n.translations = { en, pl };
i18n.locale = 'pl'; // or 'en', or dynamically set later
i18n.fallbacks = true;

export default i18n;