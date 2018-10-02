import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main/Main';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MediaWikiLoader from './App/MediaWikiLoader/MediaWikiLoader';
import registerServiceWorker from './registerServiceWorker';

class Index extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect exact={true} from="/" to="/home" />
          <Route path="/home" component={Main} />
          <Route path="/wiki/:article" render={props => <MediaWikiLoader {...props} />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Index;

ReactDOM.render(<Index />, document.getElementById('root'));
registerServiceWorker();
