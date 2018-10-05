import React, { Component } from 'react';
import './App.css';
import GoogleTranslate from './GoogleTranslate/GoogleTranslate';
import MediaWikiLoader from './MediaWikiLoader/MediaWikiLoader';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lookup: {
        text: '',
        language: ''
      },
      currentHistoryIndex: -1,
      history: [],
    };
  }

  handleSelectionChange(newSelection) {
    if (newSelection.text === '') return;

    if (
      newSelection.text === this.state.lookup.text
      &&
      newSelection.language === this.state.lookup.language
    ) {
      return;
    }

    this.setState(prevState => {
      console.log('Current State:', prevState);
      return {
        lookup: newSelection,
        currentHistoryIndex: ++prevState.currentHistoryIndex,
        history: prevState.history.slice(0, prevState.currentHistoryIndex)
          .concat(newSelection)
      };
    }, () => {
      console.log('New State:', this.state);
    });
  }

  goBack(event) {
    event.preventDefault();

    this.setState(prevState => {
      console.log('Current State:', prevState);
      return {
        lookup: prevState.history[prevState.currentHistoryIndex - 1],
        currentHistoryIndex: --prevState.currentHistoryIndex,
      };
    }, () => {
      console.log('New State:', this.state);
    });
  }

  goForward(event) {
    event.preventDefault();

    this.setState(prevState => {
      console.log('Current State:', prevState);
      return {
        lookup: prevState.history[prevState.currentHistoryIndex + 1],
        currentHistoryIndex: ++prevState.currentHistoryIndex,
      };
    }, () => {
      console.log('New State:', this.state);
    });
  }

  render() {
    return (
      <div className="App">
        <GoogleTranslate
          onSelectionChange={(newSelection) => this.handleSelectionChange(newSelection)}
          currentHistoryIndex={this.state.currentHistoryIndex}
          historyLength={this.state.history.length}
          onClickBack={event => this.goBack(event)}
          onClickForward={event => this.goForward(event)}
        />
        <MediaWikiLoader
          lookup={this.state.lookup}
          onGoToAnotherArticle={anotherArticleName => this.handleSelectionChange(anotherArticleName)}
        />
      </div>
    );
  }
}

export default App;
