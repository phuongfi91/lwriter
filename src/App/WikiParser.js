import Helper from './Helper';
import LangCode from './Language';

const TargetLanguage = Helper.getTargetLanguage();

class WikiParser {
  static createSuggestionsDiv(description, suggestions) {
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.innerHTML += description;

    suggestions.forEach((suggestion, i, arr) => {
      const b = document.createElement('b');
      b.setAttribute('className', 'Latn');
      const a = document.createElement('a');
      a.setAttribute('rel', 'mw:WikiLink');
      a.setAttribute('href', './' + suggestion);
      a.setAttribute('title', suggestion);
      a.innerText = suggestion;
      b.appendChild(a);
      suggestionsDiv.appendChild(b);
      if (i !== arr.length - 1) {
        suggestionsDiv.innerHTML += ', ';
      }
    });

    return suggestionsDiv;
  }

  static parseData(data, languageCode, suggestions) {
    var wikiHtml = (new DOMParser()).parseFromString(data, 'text/html');

    // Extract content
    var wikiContent = document.createElement('div');
    Array.from(wikiHtml.body.children)
      .forEach(child => {
        wikiContent.innerHTML += child.outerHTML;
      });

    // Add other possible suggestions
    if (suggestions) {
      const seeAlsoSection = wikiContent.querySelector('#mwAQ');
      const suggestionsDiv = this.createSuggestionsDiv('Other possible matches: ', suggestions);
      seeAlsoSection.appendChild(suggestionsDiv);
    }

    // Predict the potential language code in case it's not given
    const languages = Array.from(wikiContent.getElementsByTagName('h2'));
    const languageNames = languages.map(lang => lang.id.toString());
    const trials = [TargetLanguage, LangCode.English];
    if (!languageCode) {
      trials.some(langCode => {
        if (languageNames.includes(Helper.getLanguageName(langCode))) {
          languageCode = langCode;
          return true;
        }
        return false;
      });
    }

    // Filter out only the needed language
    if (languageCode) {
      const languageName = Helper.getLanguageName(languageCode);
      const articleHasTheLanguage = languageNames.includes(languageName);
      if (articleHasTheLanguage) {
        languages.forEach(language => {
          if (language.id.toString() !== languageName) {
            language.parentElement.remove();
          }
        });
      }
    }

    // Filter out translation in English Wiktionary
    if (languageCode === LangCode.English) {
      const translateToLanguage = Helper.getLanguageName(TargetLanguage);

      const translations = wikiContent.querySelectorAll('.translations');
      Array.from(translations)
        .forEach(translation => {
          const tables = translation.querySelectorAll('td');

          Array.from(tables)
            .forEach(table => {
              if (table.innerText.includes(translateToLanguage)) {

                const items = table.querySelectorAll('li');
                Array.from(items)
                  .forEach(item => {
                    if (!item.innerText.includes(translateToLanguage)) item.remove();
                  });
              }
              else {
                table.remove();
              }
            });
        });
    }
    return {
      wikiHtml,
      wikiContent
    };
  }
}

export default WikiParser;
