import React, { useState } from 'react';
import { Form } from 'antd';
import styles from './OrgList.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import Navbar from 'react-bootstrap/Navbar';
import Logo from 'assets/talawa-logo-200x200.png';
import SuperDashListCard from 'components/SuperDashListCard/SuperDashListCard';
import {
  ORGANIZATION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';

function OrgList(): JSX.Element {
  const [modalisOpen, setmodalIsOpen] = React.useState(false);

  const showInviteModal = () => {
    setmodalIsOpen(true);
  };
  const hideInviteModal = () => {
    setmodalIsOpen(false);
  };

  const [formState, setFormState] = useState({
    email: '',
  });

  const { data: data_2, loading: loading_2 } = useQuery(
    USER_ORGANIZATION_LIST,
    {
      variables: { id: localStorage.getItem('id') },
    }
  );

  const { data, loading } = useQuery(ORGANIZATION_LIST);

  if (loading || loading_2) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Navbar className={styles.navbarbg}>
        <Navbar.Brand>
          <Row className={styles.navallitem}>
            <a className={styles.logo} href="/">
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
              <h6 className={styles.logintitle}>You</h6>
              <p>
                Name:
                <span>
                  {data_2.user.firstName} {data_2.user.lastName}
                </span>
              </p>
              <p>
                Designation:
                <span>{data_2.user.userType}</span>
              </p>
              <p>
                Email:
                <span>{data_2.user.email}</span>
              </p>
              <p>
                Contact:
                <span></span>
              </p>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Organizations List</p>
              <button className={styles.invitebtn} onClick={showInviteModal}>
                Invite Super Admins
              </button>
            </Row>
            {data
              ? data.organizations.map(
                  (datas: { _id: string; image: string; name: string }) => {
                    return (
                      <SuperDashListCard
                        id={datas._id}
                        key={datas._id}
                        image={datas.image}
                        createdDate="05/06/2020"
                        orgName={datas.name}
                        orgLocation="Anand, Gujarat"
                      />
                    );
                  }
                )
              : null}
          </div>
        </Col>
      </Row>
      <Modal
        isOpen={modalisOpen}
        style={{
          overlay: { backgroundColor: 'grey' },
        }}
        className={styles.modalbody}
      >
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <div className={styles.flexdir}>
              <p className={styles.logintitleinvite}>Invite</p>
              <a onClick={hideInviteModal} className={styles.cancel}>
                <i className="fa fa-times"></i>
              </a>
            </div>
            <Form>
              <label>Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                autoComplete="off"
                required
                value={formState.email}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    email: e.target.value,
                  });
                }}
              />
              <button
                type="button"
                className={styles.greenregbtn}
                value="invite"
              >
                Invite Super Admin
              </button>
            </Form>
          </div>
        </section>
      </Modal>
    </>
  );
}

export default OrgList;
