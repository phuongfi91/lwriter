import './MediaWikiLoader.css';
import React from 'react';
import Axios from 'axios';
import StringSimilarity from 'string-similarity';
import logo from '../../Resources/logo.svg';
import WikiParser from '../WikiParser';
import LangCode from '../Language';

class MediaWikiLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ''
    };
  }

  handleContentChange(data, languageCode, suggestions) {
    var { wikiHtml, wikiContent } = WikiParser.parseData(data, languageCode, suggestions);

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
    attributes['onClick'] = (e) => this.handleArticleOnClick(e);

    this.setState({
      content: React.createElement('div', attributes)
    });
  }

  handleArticleOnClick(event) {
    if (event.target.rel === 'mw:WikiLink' && event.target.tagName === 'A') {
      if (this.props.onGoToAnotherArticle) {
        event.preventDefault();
        const articleName = event.target.text;
        const langCode = LangCode[event.target.hash.substr(1)];
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
  }

  requestArticle(articleName, languageCode, suggestions) {
    if (articleName === '') return;

    console.log('GET ARTICLE request sent for: ', articleName);
    const url = 'https://en.wiktionary.org:443/api/rest_v1/page/html/' + encodeURIComponent(articleName);

    Axios.request(url)
      .then((data) => this.handleContentChange(data.data, languageCode, suggestions))
      .catch((data) => {
        console.log(data);
        this.searchForArticle(articleName);
      });
  }

  searchForArticle(articleName) {
    console.log('SEARCH ARTICLE request sent for: ', articleName);
    const url = 'https://en.wiktionary.org/w/api.php?' +
      'action=query&origin=*&list=search&srlimit=max&utf8=&format=json&srsearch=' +
      encodeURIComponent(articleName);

    Axios.request(url)
      .then((data) => {
        const searchResults = [];
        data.data.query.search.forEach(result => {
          if (result.snippet.includes(articleName)) {
            searchResults.push(result.title);
          }
        });
        const matches = StringSimilarity.findBestMatch(articleName, searchResults);
        console.log('Results: ', data.data.query.search);
        console.log('Matches: ', matches);

        var suggestions = matches.ratings.map(match => {
          return match.target !== matches.bestMatch.target ? match.target : null;
        });
        suggestions = suggestions.filter(s => s);
        suggestions = suggestions.length > 0 ? suggestions : null;

        this.requestArticle(matches.bestMatch.target, null, suggestions);
      })
      .catch((data) => {
        console.log(data);
        this.searchFuzzily(articleName);
      });
  }

  searchFuzzily(articleName) {
    console.log('SIMILAR ARTICLE search request sent for: ', articleName);
    const url = 'https://en.wiktionary.org/w/api.php?action=opensearch&origin=*&search=' +
      encodeURIComponent(articleName);

    Axios.request(url)
      .then((data) => {
        const suggestions = data.data[1];
        if (suggestions.length === 0) {
          throw new Error('There is no article that closely match the input: ' + articleName);
        }
        const suggestionsDiv = WikiParser.createSuggestionsDiv('Did you mean: ', suggestions);
        this.setState({
          content: <div
            dangerouslySetInnerHTML={{ __html: suggestionsDiv.innerHTML }}
            onClick={(e) => this.handleArticleOnClick(e)}
          />
        });
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
    if (this.props.lookup) {
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
    if (!this.props.match) return;
    const articleName = this.props.match.params.article;
    const languageCode = LangCode[this.props.location.hash.substr(1)];
    this.requestArticle(articleName, languageCode);
  }

  render() {
    return this.state.content;
  }
}

export default MediaWikiLoader;
