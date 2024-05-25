import { useState} from 'react'
import '../css/Navbar.css';
import {useNavigate } from "react-router-dom";
import App from '../pages/App'

function Navbar() {

  const logout = () => {
    let token = window.localStorage.getItem("token");
    if (token){
      window.localStorage.removeItem("token");
    }
  };

    return (
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/" className="navbar-logo">
            <img src="../../banner.png"  style={{ width: '120px', height: 'auto' }}/>
          </a>
          <ul className="navbar-menu">
            {/* <li className="navbar-item"><a href="/virtuoso" className="navbar-link">virtuoso</a></li> */}
            <li className = 'navbar-item ' onClick={logout}><a href="/" className="navbar-link">logout</a></li> 
          </ul>
        </div> 
      </nav>
    );
  }
  
  export default Navbar;