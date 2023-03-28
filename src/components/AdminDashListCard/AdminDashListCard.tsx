import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';

import styles from './AdminDashListCard.module.css';
import defaultImg from 'assets/third_image.png';

interface AdminDashListCardProps {
  key: string;
  id: string;
  orgName: string;
  orgLocation: string | null;
  createdDate: string;
  image: string;
  admins: any;
  members: any;
}

function AdminDashListCard(props: AdminDashListCardProps): JSX.Element {
  const userId = localStorage.getItem('id');

  function Click() {
    const url = '/orgdash/id=' + props.id;
    window.location.replace(url);
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'superDashListCard',
  });

  return (
    <>
      <Row className={styles.orglist} data-testid="singleorg">
        {props.image ? (
          <img src={props.image} className={styles.orgimg} />
        ) : (
          <img src={defaultImg} className={styles.orgimg} />
        )}
        <Col className={styles.singledetails}>
          <div className={styles.singledetails_data_left}>
            <p className={styles.orgname}>
              {props.orgName ? <>{props.orgName}</> : <>Dogs Care</>}
            </p>
            <p className={styles.orgfont}>{props?.orgLocation}</p>
            <p className={styles.orgfontcreated}>
              {t('created')}: <span>{props.createdDate}</span>
            </p>
          </div>
          <div className={styles.singledetails_data_right}>
            <p className={styles.orgfont}>
              {t('admins')}: <span>{props?.admins.length}</span>
            </p>
            <p className={styles.orgfont}>
              {t('members')}: <span>{props?.members}</span>
            </p>
            <div className={styles.orgCreateBtnDiv}>
              <button
                className={styles.orgfontcreatedbtn}
                onClick={Click}
                disabled={
                  props.admins.length > 0 &&
                  !props.admins.some((admin: any) => admin._id === userId)
                }
              >
                {t('manage')}
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
export default AdminDashListCard;
