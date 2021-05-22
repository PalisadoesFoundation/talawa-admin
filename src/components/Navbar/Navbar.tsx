import React, { useState } from 'react';
import './Navbar.css';
import web from '../../assets/talawa-logo-lite-200x200.png';
function Navbar() {
  const [navLinkOpen, navLinkToggle] = useState(false);

  const handleNavLinksToggle = () => {
    navLinkToggle(!navLinkOpen);
  };

  const renderClasses = () => {
    let classes = 'navlinks';

    if (navLinkOpen) {
      classes += ' active';
    }

    return classes;
  };

  return (
    <nav>
      <div className="main">
        <a className="logo" href="/">
          <img src={web} />
          <strong className="green">Talawa</strong>{' '}
          <strong className="yellow">Admin</strong>
        </a>
      </div>
      <ul className={renderClasses()}>
        <li className="link">
          <a href="/">Home</a>
        </li>
        <li className="link">
          <a href="/login">Login</a>
        </li>
        <li className="link">
          <a href="/about">About</a>
        </li>
      </ul>
      <div onClick={handleNavLinksToggle} className="hamburger-toggle">
        <i className="fas fa-bars fa-lg"></i>
      </div>
    </nav>
  );
}

export default Navbar;
