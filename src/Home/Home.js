import React, { Component } from 'react';
import App from '../App/App';
import './Home.css';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';
import 'react-reflex/styles.css'

class Home extends Component {
  minNumberOfApps = 1;
  maxNumberOfApps = 4;

  constructor(props) {
    super(props);

    this.state = {
      numberOfApps: 1
    };
  }

  addApp() {
    const newNumberOfApps = Math.min(this.state.numberOfApps + 1, this.maxNumberOfApps);
    this.setState({
      numberOfApps: newNumberOfApps
    });
  }

  removeApp() {
    const newNumberOfApps = Math.max(this.minNumberOfApps, this.state.numberOfApps - 1);
    this.setState({
      numberOfApps: newNumberOfApps
    });
  }

  renderButton(text, offsetX, offsetY, onClickAction) {
    return (
      <svg cursor="pointer" width="100" height="100" className='material-button'
           onClick={onClickAction}>
        <circle cx="50" cy="50" r="40px" fill="#1d81ff" />
        <text x={offsetX} y={offsetY} alignmentBaseline="middle" textAnchor="middle" fontSize={72}
              fill="white">{text}
        </text>
      </svg>
    );
  }

  renderApps() {
    const apps = [];
    for (let i = 0; i < this.state.numberOfApps; i++) {
      if (i !== 0) {
        apps.push(<ReflexSplitter key={'Splitter_' + i} className='splitter' propagate={true}/>);
      }

      apps.push(
        <ReflexElement key={'App_' + i} minSize="320">
          <div className='pane-content'>
            <App/>
          </div>
        </ReflexElement>
      );
    }

    return (
      <ReflexContainer orientation="vertical">
        {apps}
      </ReflexContainer>
    );
  }

  render() {
    return (
      <div className='Home'>
        <div className="tools">
          {this.renderButton('+', '50%', '56%', () => this.addApp())}
          {this.renderButton('-', '50%', '50%', () => this.removeApp())}
        </div>
        <div className='apps-container'>
          {this.renderApps()}
        </div>
      </div>
    );
  }
}

export default Home;
