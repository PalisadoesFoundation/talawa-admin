import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './OrgSettings.module.css';
import UserUpdate from 'components/UserUpdate/UserUpdate';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrgDelete from 'components/OrgDelete/OrgDelete';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import MemberRequestCard from 'components/MemberRequestCard/MemberRequestCard';

function OrgSettings(): JSX.Element {
  const [t, setT] = React.useState(0);

  const currentUrl = window.location.href.split('=')[1];
  const url = '/orgdash/id=' + currentUrl;
  const url_2 = '/orgpeople/id=' + currentUrl;
  const url_3 = '/orgevents/id=' + currentUrl;
  const url_4 = '/orgcontribution/id=' + currentUrl;
  const url_5 = '/orgpost/id=' + currentUrl;
  const url_6 = '/orgsetting/id=' + currentUrl;

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
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <div>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="userupdate"
                  onClick={() => setT(1)}
                >
                  Update Your Details
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgupdate"
                  onClick={() => setT(2)}
                >
                  Update Organization
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  onClick={() => setT(3)}
                >
                  Delete Organization
                </button>
                <button
                  className={styles.greenregbtn}
                  type="button"
                  value="orgdelete"
                  onClick={() => setT(4)}
                >
                  See Request
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
            <div>{t == 1 ? <UserUpdate id="abcd" /> : null}</div>
            <div>
              {t == 2 ? (
                <OrgUpdate
                  id="abcd"
                  orgid={window.location.href.split('=')[1]}
                />
              ) : null}
            </div>
            <div>{t == 3 ? <OrgDelete /> : null}</div>
            <div>
              {t == 4 ? (
                <MemberRequestCard
                  key="string;"
                  id="string;"
                  memberName="string;"
                  memberLocation="string;"
                  joinDate="string;"
                  memberImage="https://via.placeholder.com/200x100"
                />
              ) : null}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrgSettings;
