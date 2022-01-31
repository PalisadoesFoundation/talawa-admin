import React from 'react';
import styles from './OrganizationDashboard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import AboutImg from 'assets/images/dogo.png';
import { useMutation, useQuery } from '@apollo/client';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { useSelector } from 'react-redux';
import { RootState } from 'state/reducers';
import { Button, Container } from 'react-bootstrap';

function OrganizationDashboard(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const { data, loading } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);

  const delete_org = async () => {
    if (confirm('Are you sure to Delete the Organization ?')) {
      const { data } = await del({
        variables: {
          id: currentUrl,
        },
      });
      console.log(data);
      window.location.replace('/orglist');
    } else {
      alert('Could Not Delete Organization');
    }
  };

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
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
              <Button variant="success" onClick={delete_org}>
                Delete This Organization
              </Button>
            </div>
          </div>
        </Col>
        <Col sm={8} className="mt-sm-0 mt-5 ml-4 ml-sm-0">
          <Container>
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.titlename}>Statistics</p>
              </Row>
            </div>
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationDashboard;
