import React, { useState } from 'react';
import './Navbar.css';
import web from 'assets/talawa-logo-lite-200x200.png';
function Navbar(): JSX.Element {
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
          <strong>Talawa</strong>
          <strong>Admin</strong>
        </a>
      </div>
      <ul className={renderClasses()}>
        <li className="link">
          <a href="/"></a>
        </li>
        <li className="link">
          <a href="/login"></a>
        </li>
        <li className="link">
          <a href="/about"></a>
        </li>
      </ul>
      <div onClick={handleNavLinksToggle} className="hamburger-toggle">
        <i className="fas fa-bars fa-lg"></i>
      </div>
    </nav>
  );
}

export default Navbar;
