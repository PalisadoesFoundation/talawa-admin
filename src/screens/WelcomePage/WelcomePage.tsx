// React imports
import React from 'react';

// Component Imports
import NavBar from 'components/Navbar/Navbar';

// Assets and CSS imports
import styles from './WelcomePage.module.css';

import 'css/index.css';

function WelcomePage(): JSX.Element {
  return (
    <>
      <section className="background">
        <NavBar />
        <section id={styles.grid_wrapper}>
          <div>
            <div className={styles.page_content}>
              {/* Primary Header */}
              <h3>
                Welcome to
                <b>Talawa Admin</b>
              </h3>
              {/* Secondary Header */}
              <h5>
                The online portal to manage{' '}
                <strong className="black">Talawa</strong>
              </h5>
              <a href="/login" className="btn">
                Get Started
              </a>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default WelcomePage;
