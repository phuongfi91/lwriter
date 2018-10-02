import React, { Component } from 'react';
import './App.css';
import GoogleTranslate from './GoogleTranslate/GoogleTranslate';
import MediaWikiLoader from './MediaWikiLoader/MediaWikiLoader';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: '',
    };
  }

  handleSelectionChange(newSelection) {
    this.setState({
      selection: newSelection,
    }, () => {
      console.log('Selected text: ', this.state.selection);
    });
  }

  render() {
    return (
      <div className="App">
        <GoogleTranslate
          onSelectionChange={(newSelection) => this.handleSelectionChange(newSelection)} />
        <MediaWikiLoader selection={this.state.selection} />
      </div>
    );
  }
}

export default App;
