import React, { Component } from 'react';
import phuong from '../Resources/phuong.jpg';
import github from '../Resources/github.png';
import linkedin from '../Resources/linkedin.png';
import './Contact.css';

class Contact extends Component {
  render() {
    return (
      <div className='contact-card'>
        <div className='avatar'>
          <img src={phuong} alt='avatar' />
        </div>
        <label>Phuong Nguyen</label>
        <p>Video Game Programmer</p>
        <p>Web Developer Wannabe</p>
        <p>Data Science Student</p>
        <div className='link-container'>
          <a href="https://github.com/phuongfi91">
            <img src={github} alt='GitHub' />
          </a>
          <a href="https://www.linkedin.com/in/phuongfi91/">
            <img src={linkedin} alt='LinkedIn' />
          </a>
        </div>
      </div>
    );
  }
}

export default Contact;
