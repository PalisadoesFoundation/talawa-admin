import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

import styles from './AdminDashListCard.module.css';
import defaultImg from 'assets/images/blank.png';

interface InterfaceAdminDashListCardProps {
  key: string;
  id: string;
  orgName: string;
  orgLocation: string | null;
  createdDate: string;
  image: string;
  admins: any;
  members: any;
}

function adminDashListCard(
  props: InterfaceAdminDashListCardProps
): JSX.Element {
  const userId = localStorage.getItem('id');

  function click(): void {
    const url = '/orgdash/id=' + props.id;
    window.location.replace(url);
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'adminDashListCard',
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
              <Button
                className={styles.orgfontcreatedbtn}
                onClick={click}
                disabled={
                  props.admins.length > 0 &&
                  !props.admins.some((admin: any) => admin._id === userId)
                }
              >
                {t('view')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <hr></hr>
    </>
  );
}
export {};
export default adminDashListCard;
