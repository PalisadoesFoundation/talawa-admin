import React, { useState, FormEvent } from 'react';
import { Form } from 'antd';
import styles from './SuperAdminDashboard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import SuperDashListCard from 'components/SuperDashListCard/SuperDashListCard';

function SuperAdminDashboard(): JSX.Element {
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
  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(formState);
  // };

  return (
    <>
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.logintitle}>You</h6>
              <p>
                Name:
                <span></span>
              </p>
              <p>
                Designation:
                <span></span>
              </p>
              <p>
                Email:
                <span></span>
              </p>
              <p>
                Contact:
                <span></span>
              </p>

              <h6 className={styles.logintitleadmin}>Super Admins</h6>
              <p className={styles.admindetails}>
                <p>Saumya Singh</p>
                <p>+</p>
              </p>
              <p className={styles.admindetails}>
                <p>Yasharth Dubey</p>
                <p>+</p>
              </p>
              <p className={styles.admindetails}>
                <p>Saumya Singh</p>
                <p>+</p>
              </p>
              <p className={styles.admindetails}>
                <p>Yasarth Dubey</p>
                <p>+</p>
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
            <SuperDashListCard
              key={123}
              image=""
              createdDate="05/06/2020"
              orgName="Dogs Care"
              orgLocation="Anand, Gujarat"
            />
            <SuperDashListCard
              key={124}
              image=""
              createdDate="05/07/2021"
              orgName="Dogs Care Organization"
              orgLocation="Vadodara, Gujarat"
            />
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

export default SuperAdminDashboard;
