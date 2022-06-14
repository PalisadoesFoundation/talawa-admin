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
import { Container } from 'react-bootstrap';

function OrganizationDashboard(): JSX.Element {
  document.title = 'Talawa Dashboard';
  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const { data, loading, error } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);

  const delete_org = async () => {
    const { data } = await del({
      variables: {
        id: currentUrl,
      },
    });

    /* istanbul ignore next */
    if (data) {
      window.location.replace('/orglist');
    }
  };

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error) {
    window.location.href = '/orglist';
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
              <p className={styles.tagdetailsGreen}>
                <button data-testid="deleteClick" onClick={delete_org}>
                  Delete This Organization
                </button>
              </p>
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
