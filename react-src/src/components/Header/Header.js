import React from 'react'

import './Header.css';
import logo from '../../wrench.png';

class Header extends React.Component {
  render() {
    return (
        <div className='App'>
          <div className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-intro'>VMLog</h1>
            <p>A simple Vehicle Maintenance Log for hobby mechanics!</p>
            <div className="navbar navbar-black">
              <a href="/" className="navbar-item ui button">Home</a>
            </div>
          </div>
        </div>
    )
  }
}
export default Header