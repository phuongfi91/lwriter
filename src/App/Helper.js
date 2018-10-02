import LangCode from './Language'

class Helper {
  // TODO: Refactor and use this to extend the system and work with other languages
  static getTargetLanguage() {
    return LangCode.Finnish;
  }

  static getLanguageName(languageCode) {
    var defaultLangName;
    const defaultLangCode = LangCode.English;

    for (let langName in LangCode) {
      if (LangCode[langName] === languageCode)
        return langName;

      if (LangCode[langName] === defaultLangCode)
        defaultLangName = langName;
    }
    return defaultLangName;
  }
}

export default Helper;
