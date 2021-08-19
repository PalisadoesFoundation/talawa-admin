import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Logo from 'assets/talawa-logo-200x200.png';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './OrgSettings.module.css';
import UserUpdate from 'components/UserUpdate/UserUpdate';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrgDelete from 'components/OrgDelete/OrgDelete';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';

function OrgSettings(): JSX.Element {
  const [showResults, setShowResults] = React.useState(true);
  const [showUserUpdate, setShowUserUpdate] = React.useState(false);
  const [showOrgUpdate, setShowOrgUpdate] = React.useState(false);
  const [showOrgDelete, setShowOrgDelete] = React.useState(false);

  const currentUrl = window.location.href.split('=')[1];
  const url = '/orgdash/id=' + currentUrl;
  const url_2 = '/orgpeople/id=' + currentUrl;
  const url_3 = '/orgevents/id=' + currentUrl;
  const url_4 = '/orgcontribution/id=' + currentUrl;
  const url_5 = '/orgpost/id=' + currentUrl;
  const url_6 = '/orgsettings/id=' + currentUrl;

  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Dashboard', url: url },
          { name: 'People', url: url_2 },
          { name: 'Events', url: url_3 },
          { name: 'Contributions', url: url_4 },
          { name: 'Posts', url: url_5 },
        ]}
        url_1={url_6}
      />
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
