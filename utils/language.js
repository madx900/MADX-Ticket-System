const config = require('../config');

class LanguageHandler {
    constructor() {
        this.languages = {
            ar: require('../locales/ar'),
            en: require('../locales/en')
        };
        this.defaultLang = config.language || 'ar';
    }

    getText(key, replacements = {}) {
        const lang = this.languages[this.defaultLang];
        if (!lang || !lang[key]) {
            return key;
        }

        let text = lang[key];
        // Replace all placeholders with their values
        Object.entries(replacements).forEach(([key, value]) => {
            text = text.replace(`{${key}}`, value);
        });

        return text;
    }

    setLanguage(lang) {
        if (this.languages[lang]) {
            this.defaultLang = lang;
            return true;
        }
        return false;
    }
}

module.exports = new LanguageHandler();
