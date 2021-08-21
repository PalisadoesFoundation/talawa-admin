import React, { useState } from 'react';
import styles from './OrgList.module.css';
import Logo from 'assets/talawa-logo-200x200.png';
import Modal from 'react-modal';
import { Form } from 'antd';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SuperDashListCard from 'components/SuperDashListCard/SuperDashListCard';
import {
  ORGANIZATION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

function OrgList(): JSX.Element {
  const [modalisOpen, setmodalIsOpen] = React.useState(false);

  const showInviteModal = () => {
    setmodalIsOpen(true);
  };
  const hideInviteModal = () => {
    setmodalIsOpen(false);
  };
  const [ispublicchecked, setIsPublicChecked] = React.useState(true);
  const [visiblechecked, setVisibleChecked] = React.useState(false);

  const [formState, setFormState] = useState({
    name: '',
    descrip: '',
    ispublic: false,
    visible: false,
  });

  const CreateOrg = async () => {
    const { data } = await create({
      variables: {
        name: formState.name,
        description: formState.descrip,
        visibleInSearch: formState.visible,
        isPublic: formState.ispublic,
      },
    });
    console.log(data);
    window.alert('Congratulation the Organization is created');
    window.location.replace('/orglist');
  };

  const [create, { loading: loading_3, error }] = useMutation(
    CREATE_ORGANIZATION_MUTATION
  );

  const { data: data_2, loading: loading_2 } = useQuery(
    USER_ORGANIZATION_LIST,
    {
      variables: { id: localStorage.getItem('id') },
    }
  );

  const { data, loading } = useQuery(ORGANIZATION_LIST);

  if (loading || loading_2 || loading_3) {
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
                <span> {data_2.user.userType}</span>
              </p>
              <p>
                Email:
                <span> {data_2.user.email}</span>
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
              {localStorage.getItem('UserType') == 'SUPERADMIN' ? (
                <button className={styles.invitebtn} onClick={showInviteModal}>
                  + Create Organization
                </button>
              ) : (
                <button
                  className={styles.invitebtn}
                  disabled={true}
                  onClick={showInviteModal}
                >
                  + Create Organization
                </button>
              )}
            </Row>
            <div className={styles.list_box}>
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
              <p className={styles.titlemodal}>Create Organization</p>
              <a onClick={hideInviteModal} className={styles.cancel}>
                <i className="fa fa-times"></i>
              </a>
            </div>
            <Form>
              <label htmlFor="orgname">Name</label>
              <input
                type="name"
                id="orgname"
                placeholder="Enter Name"
                autoComplete="off"
                required
                value={formState.name}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    name: e.target.value,
                  });
                }}
              />
              <label htmlFor="descrip">Description</label>
              <input
                type="descrip"
                id="descrip"
                placeholder="Enter Description"
                autoComplete="off"
                required
                value={formState.descrip}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    descrip: e.target.value,
                  });
                }}
              />
              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
                  <label htmlFor="ispublic">Is Public:</label>
                  <input
                    id="ispublic"
                    type="checkbox"
                    defaultChecked={ispublicchecked}
                    onChange={() => setIsPublicChecked(!ispublicchecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="visible">Visible: </label>
                  <input
                    id="visible"
                    type="checkbox"
                    defaultChecked={visiblechecked}
                    onChange={() => setVisibleChecked(!visiblechecked)}
                  />
                </div>
              </div>
              <label htmlFor="orgphoto" className={styles.orgphoto}>
                Display Image:
                <input
                  accept="image/*"
                  id="orgphoto"
                  name="photo"
                  type="file"
                  multiple={false}
                  //onChange=""
                />
              </label>
              <button
                type="button"
                className={styles.greenregbtn}
                value="invite"
                onClick={CreateOrg}
              >
                Create Organization
              </button>
            </Form>
          </div>
        </section>
      </Modal>
    </>
  );
}

export default OrgList;
