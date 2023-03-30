import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';
import styles from './SuperDashListCard.module.css';
import { useHistory } from 'react-router-dom';
import AboutImg from 'assets/images/defaultImg.png';

interface SuperDashListCardProps {
  key: string;
  id: string;
  orgName: string;
  orgLocation: string | null;
  createdDate: string;
  image: string;
  admins: any;
  members: any;
}

function SuperDashListCard(props: SuperDashListCardProps): JSX.Element {
  const userId = localStorage.getItem('id');
  const userType = localStorage.getItem('UserType');
  const history = useHistory();

  function handleClick() {
    const url = '/orgdash/id=' + props.id;

    /*
    WARNING!
     Please endeavor to NOT remove both the window.location.replace(url) and the history.push(url) as both are very important for routing correctly.
     Removal of the window.location.replace will result to a crash on other depending routes. History.push(url) is being used to alongside window.location.replace to keep track of the browser history stack and ensure consistency with the react component life cycle.
     */

    window.location.replace(url);
    history.push(url);
    // Do not change the lines above.
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'superDashListCard',
  });

  return (
    <>
      <Row className={styles.orglist} data-testid="singleorg">
        {props.image ? (
          <div className={styles.orgImgContainer}>
            <img src={props.image} className={styles.orgimg} />
          </div>
        ) : (
          <div className={styles.orgImgContainer}>
            <img src={AboutImg} className={styles.orgimg} />
          </div>
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
                onClick={handleClick}
                disabled={
                  userType !== 'SUPERADMIN' &&
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
export default SuperDashListCard;
