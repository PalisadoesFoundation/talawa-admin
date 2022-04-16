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
  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const { data, loading } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);

  const delete_org = async () => {
    const { data } = await del({
      variables: {
        id: currentUrl,
      },
    });
    //console.log(data);
    window.location.replace('/orglist');
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
              <p>
                <button data-testid="deleteClick" onClick={delete_org} className={styles.tagdetailsGreen}>
                <svg className={styles.paddingbtn}  xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/></svg>
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
