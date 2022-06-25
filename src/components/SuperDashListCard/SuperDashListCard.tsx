import React from 'react';
import styles from './SuperDashListCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface SuperDashListCardProps {
  key: string;
  id: string;
  orgName: string;
  orgLocation: string | null;
  createdDate: string;
  image: string;
  admins: any;
  members: string;
}

function SuperDashListCard(props: SuperDashListCardProps): JSX.Element {
  const userId = localStorage.getItem('id');
  const userType = localStorage.getItem('UserType');

  function Click() {
    const url = '/orgdash/id=' + props.id;
    window.location.replace(url);
  }

  return (
    <>
      <Row className={styles.orglist}>
        {props.image ? (
          <img src={props.image} className={styles.orgimg} />
        ) : (
          <img
            src="https://via.placeholder.com/200x100"
            className={styles.orgimg}
          />
        )}
        <Col className={styles.singledetails}>
          <div className={styles.singledetails_data_left}>
            <p className={styles.orgname}>
              {props.orgName ? <>{props.orgName}</> : <>Dogs Care</>}
            </p>
            <p className={styles.orgfont}>{props?.orgLocation}</p>
            <p className={styles.orgfontcreated}>
              Created: <span>{props.createdDate}</span>
            </p>
          </div>
          <div className={styles.singledetails_data_right}>
            <p className={styles.orgfont}>
              Admins: <span>{props?.admins.length}</span>
            </p>
            <p className={styles.orgfont}>
              Members: <span>{props?.members}</span>
            </p>
            <div className={styles.orgCreateBtnDiv}>
              <button
                className={styles.orgfontcreatedbtn}
                onClick={Click}
                disabled={
                  userType !== 'SUPERADMIN' &&
                  !props.admins.some((admin: any) => admin._id === userId)
                }
              >
                Manage
              </button>
            </div>
          </div>
        </Col>
      </Row>
      <hr></hr>
    </>
  );
}
export {};
export default SuperDashListCard;
