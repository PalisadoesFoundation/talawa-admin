import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import type { InterfaceUserType } from 'utils/interfaces';
import { ReactComponent as AngleRightIcon } from '../../assets/svgs/icons/angleRight.svg';
import { ReactComponent as LogoutIcon } from '../../assets/svgs/icons/logout.svg';
import { ReactComponent as OrganizationsIcon } from '../../assets/svgs/icons/organizations.svg';
import { ReactComponent as RequestsIcon } from '../../assets/svgs/icons/requests.svg';
import { ReactComponent as RolesIcon } from '../../assets/svgs/icons/roles.svg';
import { ReactComponent as TalawaLogo } from '../../assets/svgs/talawa.svg';
import styles from './LeftDrawer.module.css';

interface InterfaceLeftDrawerProps {
  data: InterfaceUserType | undefined;
  showDrawer: boolean;
}

const leftDrawer = ({
  data,
  showDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { user } = data || {};

  useEffect(() => {
    console.log('Useffect called');
  }, [showDrawer]);

  return (
    <div
      className={`${styles.leftDrawer} ${
        showDrawer ? styles.activeDrawer : styles.inactiveDrawer
      }`}
    >
      <TalawaLogo className={styles.talawaLogo} />
      <p className={styles.talawaText}>Talawa Admin Portal</p>
      <h5 className={styles.titleHeader}>Menu</h5>
      <div className={styles.optionList}>
        <Button variant="success">
          <div className={styles.iconWrapper}>
            <OrganizationsIcon stroke={'var(--bs-white)'} />
          </div>
          Organizations
        </Button>
        <Button variant="light" className={'text-secondary'}>
          <div className={styles.iconWrapper}>
            <RequestsIcon fill={'var(--bs-secondary)'} />
          </div>
          Requests
        </Button>
        <Button variant="light" className={'text-secondary'}>
          <div className={styles.iconWrapper}>
            <RolesIcon fill={'var(--bs-secondary)'} />
          </div>
          Roles
        </Button>
      </div>
      <div style={{ marginTop: 'auto' }}>
        {data === undefined ? (
          <div className={`${styles.profileContainer} ${styles.shine}`} />
        ) : (
          <button className={styles.profileContainer}>
            <div className={styles.imageContainer}>
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
                alt={`profile pic of ${user?.firstName} ${user?.lastName}`}
              />
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>
                {user?.firstName} {user?.lastName}
              </span>
              <span className={styles.secondaryText}>
                {`${user?.userType}`.toLowerCase()}
              </span>
            </div>
            <AngleRightIcon fill={'var(--bs-secondary)'} />
          </button>
        )}

        <Button
          variant="light"
          className="mt-4 d-flex justify-content-start px-0 mb-2 w-100"
        >
          <div className={styles.imageContainer}>
            <LogoutIcon fill={'var(--bs-secondary)'} />
          </div>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default leftDrawer;
