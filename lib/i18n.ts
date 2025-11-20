import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// Import translation files
import en from './translations/en.json';
import tr from './translations/tr.json';

/**
 * i18n instance with translations loaded from JSON files.
 * Supports English (en) and Turkish (tr) locales.
 */
const i18n = new I18n({
  en,
  tr,
});

// Set the locale based on device settings
i18n.locale = getLocales()[0].languageCode ?? 'en';

// Enable fallback to English when a translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
