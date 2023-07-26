import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from './SuperDashListCard.module.css';
import { useHistory } from 'react-router-dom';
import AboutImg from 'assets/images/defaultImg.png';
import type { InterfaceOrgConnectionInfoType } from 'utils/interfaces';

interface InterfaceSuperDashListCardProps {
  data: InterfaceOrgConnectionInfoType;
}

function superDashListCard(
  props: InterfaceSuperDashListCardProps
): JSX.Element {
  const { _id, admins, image, location, members, name } = props.data ?? [];
  console.log(props.data);

  const userId = localStorage.getItem('id');
  const userType = localStorage.getItem('UserType');
  const history = useHistory();

  function handleClick(): void {
    const url = '/orgdash/id=' + _id;

    window.location.replace(url);
    history.push(url);
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'superDashListCard',
  });

  return (
    <>
      <div className={styles.orgCard} data-testid="singleorg">
        <div className={styles.innerContainer}>
          <div className={styles.orgImgContainer}>
            <div className={styles.overlayTheme} />
            {image ? (
              <img src={image} className={styles.orgimg} />
            ) : (
              <img src={AboutImg} className={styles.orgimg} />
            )}
          </div>
          <div className={styles.content}>
            <h5>{name}</h5>
            <h6 className="text-secondary">{location}</h6>
            <h6>
              {t('admins')}: <span>{admins.length}</span>
            </h6>
            <h6>
              {t('members')}: <span>{members.length}</span>
            </h6>
          </div>
        </div>
        <Button
          onClick={handleClick}
          disabled={
            userType !== 'SUPERADMIN' &&
            admins.length > 0 &&
            !admins.some((admin: any) => admin._id === userId)
          }
        >
          {t('manage')}
        </Button>
      </div>
    </>
  );
}
export {};
export default superDashListCard;
