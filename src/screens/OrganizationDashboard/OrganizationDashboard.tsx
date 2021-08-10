import React from 'react';
import styles from './OrganizationDashboard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import AboutImg from 'assets/images/dogo.png';
import { useQuery } from '@apollo/client';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';

function OrganizationDashboard(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];

  const { data, loading } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  const url = '/orgpeople/id=' + currentUrl;
  console.log(url);

  return (
    <>
      <AdminNavbar targets={[{ name: 'People', url: url }]} />
      <Row className={styles.toporginfo}>
        <p></p>
        <p className={styles.toporgname}>{data.organizations[0].name}</p>
        <p className={styles.toporgloc}>Location : </p>
      </Row>
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.titlename}>About</h6>
              <p>{data.organizations[0].description}</p>
              <img src={AboutImg} className={styles.org_about_img} />
              <h6 className={styles.titlename}>Tags</h6>
              <p className={styles.tagdetails}>
                <button>Shelter</button>
                <button>Donation</button>
              </p>
              <p className={styles.tagdetails}>
                <button>Dogs</button>
                <button>Care</button>
              </p>
              <p className={styles.tagdetails}>
                <button>NGO</button>
              </p>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.titlename}>Statistics</p>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationDashboard;
