import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

import styles from './AdminDashListCard.module.css';
import defaultImg from 'assets/images/blank.png';
import type { InterfaceOrgConnectionInfoType } from 'utils/interfaces';

interface InterfaceAdminDashListCardProps {
  data: InterfaceOrgConnectionInfoType;
}

function adminDashListCard(
  props: InterfaceAdminDashListCardProps
): JSX.Element {
  const { _id, admins, createdAt, creator, image, location, members, name } =
    props.data ?? [];

  const userId = localStorage.getItem('id');
  function click(): void {
    const url = '/orgdash/id=' + _id;
    window.location.replace(url);
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'adminDashListCard',
  });

  return (
    <>
      <Row className={styles.orglist} data-testid="singleorg">
        {image ? (
          <img src={image} className={styles.orgimg} />
        ) : (
          <img src={defaultImg} className={styles.orgimg} />
        )}
        <Col className={styles.singledetails}>
          <div className={styles.singledetails_data_left}>
            <p className={styles.orgname}>{name ? <>{name}</> : <></>}</p>
            <p className={styles.orgfont}>{location}</p>
            <p className={styles.orgfontcreated}>
              {t('created')}: <span>{createdAt}</span>
            </p>
          </div>
          <div className={styles.singledetails_data_right}>
            <p className={styles.orgfont}>
              {t('admins')}: <span>{admins.length}</span>
            </p>
            <p className={styles.orgfont}>
              {t('members')}: <span>{members.length}</span>
            </p>
            <div className={styles.orgCreateBtnDiv}>
              <Button
                className={styles.orgfontcreatedbtn}
                onClick={click}
                disabled={
                  admins.length > 0 &&
                  !admins.some((admin: any) => admin._id === userId)
                }
              >
                {t('view')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
export {};
export default adminDashListCard;
