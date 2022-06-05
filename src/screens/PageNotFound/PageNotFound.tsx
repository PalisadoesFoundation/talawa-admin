import React from 'react';
import { Link } from 'react-router-dom';

import './PageNotFound.css';
import Logo from 'assets/talawa-logo-200x200.png';

const PageNotFound = (): JSX.Element => {
  document.title = '404 Not Found';

  return (
    <section className="notfound">
      <div className="container text-center">
        <div className="brand">
          <img src={Logo} alt="Logo" className="img-fluid" />
          <h3 className="text-uppercase mt-4">Talawa Admin</h3>
        </div>
        <h1 className="head">
          <span>404</span>
        </h1>
        <p>Oops! The Page you requested was not found!</p>
        <Link to="/" className="btn btn-outline-success mt-3">
          <i className="fas fa-home"></i> Back to Home
        </Link>
      </div>
    </section>
  );
};

export default PageNotFound;
