import React, { Component } from 'react';
import './App.css';
import GoogleTranslate from './GoogleTranslate/GoogleTranslate';
import MediaWikiLoader from './MediaWikiLoader/MediaWikiLoader';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: '',
      currentHistoryIndex: -1,
      history: [],
    };
  }

  handleSelectionChange(newSelection) {
    if (newSelection === '' || newSelection === this.state.selection) return;
    this.setState(prevState => {
      console.log('Current State:', prevState);
      return {
        selection: newSelection,
        currentHistoryIndex: ++prevState.currentHistoryIndex,
        history: prevState.history.slice(0, prevState.currentHistoryIndex)
          .concat(newSelection)
      };
    }, () => {
      console.log('New State:', this.state)
    });
  }

  goBack(event) {
    event.preventDefault();
    this.setState(prevState => {
      console.log('Current State:', prevState);
      return {
        selection: prevState.history[prevState.currentHistoryIndex - 1],
        currentHistoryIndex: --prevState.currentHistoryIndex,
      };
    }, () => {
      console.log('New State:', this.state)
    });
  }

  goForward(event) {
    event.preventDefault();
    this.setState(prevState => {
      console.log('Current State:', prevState);
      return {
        selection: prevState.history[prevState.currentHistoryIndex + 1],
        currentHistoryIndex: ++prevState.currentHistoryIndex,
      };
    }, () => {
      console.log('New State:', this.state)
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
          selection={this.state.selection}
          onGoToAnotherArticle={anotherArticleName => this.handleSelectionChange(anotherArticleName)}
        />
      </div>
    );
  }
}

export default App;
