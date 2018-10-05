import './MediaWikiLoader.css';
import React from 'react';
import Axios from 'axios';
import StringSimilarity from 'string-similarity';
import logo from '../../Resources/logo.svg';
import Helper from '../Helper';
import LangCode from '../Language';

const TargetLanguage = Helper.getTargetLanguage();

class MediaWikiLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ''
    };
  }

  handleContentChange(data, languageCode) {
    var { wikiHtml, wikiContent } = this.parseData(data, languageCode);

    // Use Wikipedia content stylesheet
    const wikiCssId = 'wiki-css';
    const wikiCss = document.getElementById(wikiCssId);
    if (!wikiCss) {
      let stylesheetElem = wikiHtml.querySelector('head link[rel="stylesheet"]');
      stylesheetElem.setAttribute('id', wikiCssId);
      document.head.appendChild(stylesheetElem);
    }

    // Create and return the react element
    var attributes = {};
    Array.from(wikiHtml.body.attributes)
      .forEach(attr => {
        if (attr.text === 'class') return;
        attributes[attr.text] = attr.value;
      });
    attributes['className'] = 'Media-wiki-loader';
    attributes['dangerouslySetInnerHTML'] = {
      __html: wikiContent.innerHTML
    };
    attributes['onClick'] = (e) => {
      console.log(e);
      if (e.target.rel === 'mw:WikiLink' && e.target.tagName === 'A') {
        if (this.props.onGoToAnotherArticle) {
          e.preventDefault();
          const articleName = e.target.text;
          const langCode = LangCode[e.target.hash.substr(1)];
          this.props.onGoToAnotherArticle(
            {
              text: articleName,
              language: langCode
            }
          );
          this.requestArticle(articleName, langCode);
          this.renderLoadingIndicator();
        }
        else {
          window.location.reload();
        }
      }
    };

    this.setState({
      content: React.createElement('div', attributes)
    });
  }

  parseData(data, languageCode) {
    var wikiHtml = (new DOMParser()).parseFromString(data, 'text/html');

    // Extract content
    var wikiContent = document.createElement('div');
    Array.from(wikiHtml.body.children)
      .forEach(child => {
        wikiContent.innerHTML += child.outerHTML;
      });

    // Predict the potential language code in case it's not given
    const languages = Array.from(wikiContent.getElementsByTagName('h2'));
    const languageNames = languages.map(lang => lang.id.toString());
    const trials = [TargetLanguage, LangCode.English];
    if (languageCode === undefined) {
      trials.some(langCode => {
        if (languageNames.includes(Helper.getLanguageName(langCode))) {
          languageCode = langCode;
          return true;
        }
        return false;
      });
    }

    // Filter out only the needed language
    if (languageCode !== undefined) {
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

    // Filter out translation in English wiktionary
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

  requestArticle(articleName, languageCode) {
    if (articleName === '') return;

    console.log('GET ARTICLE request sent for: ', articleName);
    const url = 'https://en.wiktionary.org:443/api/rest_v1/page/html/' + encodeURIComponent(articleName);

    Axios.request(url)
      .then((data) => this.handleContentChange(data.data, languageCode))
      .catch((data) => {
        console.log(data);
        this.searchForArticle(articleName);
      });
  }

  searchForArticle(articleName) {
    console.log('SEARCH ARTICLE request sent for: ', articleName);
    const url = 'https://en.wiktionary.org/w/api.php?action=query&origin=*&list=search&utf8=&format=json&srsearch='
      + encodeURIComponent(articleName);

    Axios.request(url)
      .then((data) => {
        const searchResults = [];
        data.data.query.search.forEach(result => {
          searchResults.push(result.title);
        });
        const matches = StringSimilarity.findBestMatch(articleName, searchResults);
        console.log(matches);

        this.requestArticle(matches.bestMatch.target);
      })
      .catch((data) => {
        console.log(data);
        this.setState({
          content: <div className='bad-query-text'>
            <label>
              Found no Wiktionary entries with title '{articleName}'
            </label>
          </div>
        });
      });
  }

  renderLoadingIndicator() {
    this.setState({
      content: (<div>
        <img src={logo} className="loader" alt="Loading..." />
      </div>)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Handle page fetching when used with the translation system
    if (this.props.lookup !== undefined) {
      if (
        this.props.lookup.text !== nextProps.lookup.text ||
        this.props.lookup.language !== nextProps.lookup.language
      ) {
        if (nextProps.lookup.text !== '') {
          this.renderLoadingIndicator();
        }
        this.requestArticle(nextProps.lookup.text, nextProps.lookup.language);
      }
    }
    return true;
  }

  componentWillMount() {
    // Handle page fetching when used as a standalone component
    if (this.props.match === undefined) return;
    const articleName = this.props.match.params.article;
    const languageCode = LangCode[this.props.location.hash.substr(1)];
    this.requestArticle(articleName, languageCode);
  }

  render() {
    return this.state.content;
  }
}

export default MediaWikiLoader;
