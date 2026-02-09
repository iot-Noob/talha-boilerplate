import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import locales
import en from '../locales/en.json';
import es from '../locales/es.json';
import ar from '../locales/ar.json';
import fr from '../locales/fr.json';
import zh from '../locales/zh.json';
import hi from '../locales/hi.json';
import ur from '../locales/ur.json';
import pt from '../locales/pt.json';
import bn from '../locales/bn.json';
import ru from '../locales/ru.json';
import ja from '../locales/ja.json';
import de from '../locales/de.json';
import ko from '../locales/ko.json';
import tr from '../locales/tr.json';
import it from '../locales/it.json';
import fa from '../locales/fa.json';
import pl from '../locales/pl.json';
import uk from '../locales/uk.json';
import th from '../locales/th.json';
import vi from '../locales/vi.json';
import he from '../locales/he.json';
import id from '../locales/id.json';
import nl from '../locales/nl.json';
import sv from '../locales/sv.json';
import el from '../locales/el.json';
import cs from '../locales/cs.json';
import ro from '../locales/ro.json';
import hu from '../locales/hu.json';

const resources = {
    en: { translation: en },
    es: { translation: es },
    ar: { translation: ar },
    fr: { translation: fr },
    zh: { translation: zh },
    hi: { translation: hi },
    ur: { translation: ur },
    pt: { translation: pt },
    bn: { translation: bn },
    ru: { translation: ru },
    ja: { translation: ja },
    de: { translation: de },
    ko: { translation: ko },
    tr: { translation: tr },
    it: { translation: it },
    fa: { translation: fa },
    pl: { translation: pl },
    uk: { translation: uk },
    th: { translation: th },
    vi: { translation: vi },
    he: { translation: he },
    id: { translation: id },
    nl: { translation: nl },
    sv: { translation: sv },
    el: { translation: el },
    cs: { translation: cs },
    ro: { translation: ro },
    hu: { translation: hu }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
