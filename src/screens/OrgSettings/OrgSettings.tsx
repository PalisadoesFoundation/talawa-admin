import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Logo from 'assets/talawa-logo-200x200.png';
import Row from 'react-bootstrap/Row';
import styles from './OrgSettings.module.css';
function OrgSettings(): JSX.Element {
  return (
    <>
      <Navbar className={styles.navbarbg}>
        <Navbar.Brand>
          <Row className={styles.navallitem}>
            <a className={styles.logo} href="/orglist">
              <img src={Logo} />
              <strong>Talawa Portal</strong>
            </a>
          </Row>
        </Navbar.Brand>
      </Navbar>
      <h1>Testing settings page</h1>
    </>
  );
}
export default OrgSettings;
