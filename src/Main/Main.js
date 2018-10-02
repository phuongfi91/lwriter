import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import Home from '../Home/Home';
import Contact from '../Contact/Contact';
import logo from '../Resources/logo.svg';
import './Main.css';

class Main extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul className="Header">
            <img src={logo} className="logo" alt="logo" />
            <label>FINNISH LANGUAGE TOOL</label>
            <li><NavLink exact to="/home">Home</NavLink></li>
            <li><NavLink to="/home/contact">Contact</NavLink></li>
          </ul>
          <div className="Content">
            <Switch>
              <Route exact path="/home" component={Home} />
              <Route path="/home/contact" component={Contact} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default Main;
