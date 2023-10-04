import React from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawerOrg.module.css';
import IconComponent from 'components/IconComponent/IconComponent';

export interface InterfaceLeftDrawerProps {
  event: {
    _id: string;
    title: string;
    description: string;
  };
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const leftDrawerEvent = ({
  event,
  hideDrawer,
  setHideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const userType = localStorage.getItem('UserType');
  const firstName = localStorage.getItem('FirstName');
  const lastName = localStorage.getItem('LastName');
  const userImage = localStorage.getItem('UserImage');

  const history = useHistory();
  const logout = (): void => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <>
      <div
        className={`${styles.leftDrawer} ${
          hideDrawer === null
            ? styles.hideElemByDefault
            : hideDrawer
            ? styles.inactiveDrawer
            : styles.activeDrawer
        }`}
        data-testid="leftDrawerContainer"
      >
        {/* Close Drawer Button for small devices */}
        <Button
          variant="danger"
          className={styles.closeModalBtn}
          onClick={(): void => {
            setHideDrawer(false);
          }}
          data-testid="closeModalBtn"
        >
          <i className="fa fa-times"></i>
        </Button>

        {/* Branding Section */}
        <div className={styles.brandingContainer}>
          <TalawaLogo className={styles.talawaLogo} />
          <span className={styles.talawaText}>Talawa Admin Portal</span>
        </div>

        {/* Event Detail Section */}
        <div className={styles.organizationContainer}>
          <button className={styles.profileContainer} data-testid="OrgBtn">
            <div className={styles.imageContainer}>
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${event.title
                  .split(' ')
                  .join('%20')}`}
                alt={`Dummy Event Picture`}
              />
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>{event.title}</span>
              <span className={styles.secondaryText}>{event.description}</span>
            </div>
          </button>
        </div>

        {/* Options List */}
        {/* <div className={styles.optionList}>
          <h5 className={styles.titleHeader}>{t('menu')}</h5>
          {targets.map(({ name, url }, index) => {
            return url ? (
              <Button
                key={name}
                variant={screenName === name ? 'success' : 'light'}
                className={`${
                  screenName === name ? 'text-white' : 'text-secondary'
                }`}
                onClick={(): void => {
                  history.push(url);
                }}
              >
                <div className={styles.iconWrapper}>
                  <IconComponent
                    name={name}
                    fill={
                      screenName === name
                        ? 'var(--bs-white)'
                        : 'var(--bs-secondary)'
                    }
                  />
                </div>
                {name}
              </Button>
            ) : (
              <CollapsibleDropdown
                key={name}
                screenName={screenName}
                target={targets[index]}
              />
            );
          })}
        </div> */}

        {/* Profile Section & Logout Btn */}
        <div style={{ marginTop: 'auto' }}>
          <button
            className={styles.profileContainer}
            data-testid="profileBtn"
            onClick={(): void => {
              toast.success('Profile Page coming soon!');
            }}
          >
            <div className={styles.imageContainer}>
              {userImage && userImage ? (
                <img src={userImage} alt={`Profile Picture`} />
              ) : (
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`}
                  alt={`Dummy User Picture`}
                />
              )}
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>
                {firstName} {lastName}
              </span>
              <span className={styles.secondaryText}>
                {`${userType}`.toLowerCase()}
              </span>
            </div>
            <AngleRightIcon fill={'var(--bs-secondary)'} />
          </button>
          <Button
            variant="light"
            className="mt-4 d-flex justify-content-start px-0 mb-2 w-100"
            onClick={(): void => logout()}
            data-testid="logoutBtn"
          >
            <div className={styles.imageContainer}>
              <LogoutIcon fill={'var(--bs-secondary)'} />
            </div>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default leftDrawerEvent;
