import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    welcome: 'Welcome to SafeChara',
    dashboard: 'Dashboard',
    test_feed: 'Test Feed',
    test_silage: 'Test Silage',
  },
  hi: {
    welcome: 'सेफचारा में आपका स्वागत है',
    dashboard: 'डैशबोर्ड',
    test_feed: 'चारा टेस्ट करें',
    test_silage: 'साइलेज टेस्ट करें',
  },
};

const i18n = new I18n(translations);
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
i18n.enableFallback = true;

export default i18n;
