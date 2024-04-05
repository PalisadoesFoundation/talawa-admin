import React from 'react';
import Button from 'react-bootstrap/Button';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import { useHistory } from 'react-router-dom';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawerEvent.module.css';
import IconComponent from 'components/IconComponent/IconComponent';
import { EventRegistrantsWrapper } from 'components/EventRegistrantsModal/EventRegistrantsWrapper';
import { CheckInWrapper } from 'components/CheckIn/CheckInWrapper';
<<<<<<< HEAD
import { ActionItemsWrapper } from 'components/ActionItems/ActionItemsWrapper';
import { EventStatsWrapper } from 'components/EventStats/EventStatsWrapper';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
=======
import { EventStatsWrapper } from 'components/EventStats/EventStatsWrapper';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

export interface InterfaceLeftDrawerProps {
  event: {
    _id: string;
    title: string;
    description: string;
    organization: {
      _id: string;
    };
  };
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
<<<<<<< HEAD
=======
  setShowAddEventProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
}

const leftDrawerEvent = ({
  event,
  hideDrawer,
<<<<<<< HEAD
}: InterfaceLeftDrawerProps): JSX.Element => {
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  const { getItem } = useLocalStorage();
  const userType = getItem('UserType');
  const firstName = getItem('FirstName');
  const lastName = getItem('LastName');
  const userImage = getItem('UserImage');
  const userId = getItem('id');

  const navigate = useNavigate();
  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    navigate('/');
=======
  setHideDrawer,
  setShowAddEventProjectModal,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const userType = localStorage.getItem('UserType');
  const firstName = localStorage.getItem('FirstName');
  const lastName = localStorage.getItem('LastName');
  const userImage = localStorage.getItem('UserImage');
  const userId = localStorage.getItem('id');

  const history = useHistory();
  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    history.push('/');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  };

  return (
    <>
      <div
        className={`${styles.leftDrawer} ${
          hideDrawer === null
            ? styles.hideElemByDefault
            : hideDrawer
<<<<<<< HEAD
              ? styles.inactiveDrawer
              : styles.activeDrawer
        }`}
        data-testid="leftDrawerContainer"
      >
=======
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

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        {/* Branding Section */}
        <div className={styles.brandingContainer}>
          <TalawaLogo className={styles.talawaLogo} />
          <span className={styles.talawaText}>Talawa Admin Portal</span>
        </div>

        {/* Event Detail Section */}
        <div className={styles.organizationContainer}>
          <button className={styles.profileContainer} data-testid="OrgBtn">
            <div className={styles.imageContainer}>
<<<<<<< HEAD
              <Avatar
                name={event.title.split(' ').join('%20')}
=======
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${event.title
                  .split(' ')
                  .join('%20')}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                alt="Dummy Event Picture"
              />
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>
                {event.title && event.title.length > 20
                  ? event.title.substring(0, 20) + '...'
                  : event.title}
              </span>
              <span className={styles.secondaryText}>
                {event.description && event.description.length > 30
                  ? event.description.substring(0, 30) + '...'
                  : event.description}
              </span>
            </div>
          </button>
        </div>

        {/* Options List */}
        <div className={styles.optionList}>
          <h5 className={styles.titleHeader}>Event Options</h5>
<<<<<<< HEAD
=======
          <Button
            variant="light"
            className="text-secondary"
            aria-label="addEventProject"
            onClick={(): void => {
              setShowAddEventProjectModal(true);
            }}
          >
            <div className={styles.iconWrapper}>
              <IconComponent
                name="Add Event Project"
                fill="var(--bs-secondary)"
              />
            </div>
            Add an Event Project
          </Button>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          <EventRegistrantsWrapper
            key={`${event?._id || 'loading'}Registrants`}
            eventId={event._id}
            orgId={event.organization._id}
          />
          <CheckInWrapper
            eventId={event._id}
            key={`${event?._id || 'loading'}CheckIn`}
          />
<<<<<<< HEAD
          <ActionItemsWrapper
            key={`${event?._id || 'loading'} ActionItems`}
            orgId={event.organization._id}
            eventId={event._id}
          />
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          <EventStatsWrapper
            eventId={event._id}
            key={`${event?._id || 'loading'}Stats`}
          />
          <Button
            variant="light"
            data-testid="allEventsBtn"
            className="text-secondary"
            aria-label="allEvents"
            onClick={(): void => {
<<<<<<< HEAD
              navigate(`/orgevents/id=${event.organization._id}`);
=======
              history.push(`/orgevents/id=${event.organization._id}`);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
            }}
          >
            <div className={styles.iconWrapper}>
              <IconComponent name="Events" fill="var(--bs-secondary)" />
            </div>
            All Events
          </Button>
        </div>

        {/* Profile Section & Logout Btn */}
        <div style={{ marginTop: 'auto' }}>
          <button
            className={styles.profileContainer}
            data-testid="profileBtn"
            onClick={(): void => {
<<<<<<< HEAD
              navigate(`/member/id=${userId}`);
            }}
          >
            <div className={styles.imageContainer}>
              {userImage && userImage !== 'null' ? (
                <img src={userImage} alt={`Profile Picture`} />
              ) : (
                <Avatar
                  name={`${firstName} ${lastName}`}
=======
              history.push(`/member/id=${userId}`);
            }}
          >
            <div className={styles.imageContainer}>
              {userImage && userImage ? (
                <img src={userImage} alt={`Profile Picture`} />
              ) : (
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            className={`mt-4 d-flex justify-content-start px-0 w-100 ${styles.logout}`}
=======
            className="mt-4 d-flex justify-content-start px-0 mb-2 w-100"
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
