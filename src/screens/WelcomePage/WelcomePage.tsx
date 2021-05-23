// React imports
import React from 'react';

// Component Imports
import Navbar from 'components/Navbar/Navbar';

// Assets and CSS imports
import styles from './WelcomePage.module.css';

import 'css/index.css';

function WelcomePage(): JSX.Element {
  return (
    <>
      <section className="background">
        <Navbar />
        <section id={styles.grid_wrapper}>
          <div className={styles.flex_wrapper}>
            <div className={styles.page_content}>
              {/* Primary Header */}
              <h3>
                Welcome to <strong className="black">Talawa Admin</strong>
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
