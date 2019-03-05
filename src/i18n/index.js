import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: require('./locale/en'),
  zh: require('./locale/zh'),
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });


export default i18n;
