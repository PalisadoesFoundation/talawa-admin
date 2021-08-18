import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Logo from 'assets/talawa-logo-200x200.png';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './OrgSettings.module.css';
import UserUpdate from 'components/UserUpdate/UserUpdate';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrgDelete from 'components/OrgDelete/OrgDelete';

function OrgSettings(): JSX.Element {
  const [showResults, setShowResults] = React.useState(true);
  const [showUserUpdate, setShowUserUpdate] = React.useState(false);
  const [showOrgUpdate, setShowOrgUpdate] = React.useState(false);
  const [showOrgDelete, setShowOrgDelete] = React.useState(false);
  // const onClick = () => setShowResults(!showResults);
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
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <div>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="userupdate"
                  onClick={() => setShowUserUpdate(!showUserUpdate)}
                >
                  Update Your Details
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgupdate"
                  onClick={() => setShowOrgUpdate(!showOrgUpdate)}
                >
                  Update Organization
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  onClick={() => setShowOrgDelete(!showOrgDelete)}
                >
                  Delete Organization
                </button>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Settings</p>
            </Row>
            <div>
              {showUserUpdate ? (
                <UserUpdate id="AB123RE" userid="AB123RE" />
              ) : null}
            </div>
            <div>
              {showOrgUpdate ? (
                <OrgUpdate id="AB123RE" orgid="AB123RE" />
              ) : null}
            </div>
            <div>{showOrgDelete ? <OrgDelete /> : null}</div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrgSettings;
