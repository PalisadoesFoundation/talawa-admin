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
import { FaTrash } from 'react-icons/fa';

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
    console.log(data);
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
            </div>

            <button className={styles.invitebtn} onClick={delete_org}>
              <FaTrash className={styles.icon} size={18} />
              Delete Organization
            </button>
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
