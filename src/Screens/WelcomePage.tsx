import React from 'react';
import Navbar from '../SharedComponents/Navbar';
import '../css/Home.css';
import '../css/Index.css';
import web from '../assets/first_image.png';
function WelcomePage() {
  return (
    <>
      <section className="background">
        <Navbar />
        <div className="display">
          <div className="margin">
            <h3>
              Welcome to <strong className="Color_Yellow">Talawa Admin</strong>
            </h3>
            <h5>
              The online portal to manage{' '}
              <strong className="Color_Green">Talawa</strong>
            </h5>
            <a href="/Login" className="btn">
              Get Started
            </a>
          </div>
          <div className="animated">
            <img src={web} className="image" />
          </div>
        </div>
      </section>
    </>
  );
}

export default WelcomePage;
