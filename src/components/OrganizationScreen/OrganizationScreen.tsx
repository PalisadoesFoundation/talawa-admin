import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  useNavigate,
  Outlet,
  useLocation,
  useParams,
} from 'react-router-dom';
import { updateTargets } from 'state/action-creators';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './OrganizationScreen.module.css';
import Avatar from 'components/Avatar/Avatar';
import { Dropdown, ButtonGroup } from 'react-bootstrap'; // Changed from DropdownButton to Dropdown
import { useMutation } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';

const OrganizationScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const titleKey = map[location.pathname.split('/')[1]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);
  const { getItem } = useLocalStorage();
  const userType = getItem('UserType');
  const firstName = getItem('FirstName');
  const lastName = getItem('LastName');
  const userImage = getItem('UserImage');
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const appRoutes: {
    targets: TargetsType[];
  } = useSelector((state: RootState) => state.appRoutes);
  const { targets } = appRoutes;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateTargets(orgId));
  }, [orgId]); // Added orgId to the dependency array

  const handleResize = (): void => {
    if (window.innerWidth <= 820 && !hideDrawer) {
      setHideDrawer(true);
    }
  };
  /*istanbul ignore next*/
  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    navigate('/');
  };

  const toggleDrawer = (): void => {
    setHideDrawer(!hideDrawer);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hideDrawer]);

  return (
    <>
      <Button
        className={
          hideDrawer ? styles.opendrawer : styles.collapseSidebarButton
        }
        onClick={toggleDrawer}
        data-testid="toggleMenuBtn"
      >
        <i
          className={
            hideDrawer ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
          }
          aria-hidden="true"
        ></i>
      </Button>
      <div className={styles.drawer}>
        <LeftDrawerOrg
          orgId={orgId}
          targets={targets}
          hideDrawer={hideDrawer}
          setHideDrawer={setHideDrawer}
        />
      </div>
      <div
        className={`${styles.pageContainer} ${
          hideDrawer === null
            ? ''
            : hideDrawer
              ? styles.expand
              : styles.contract
        } `}
        data-testid="mainpageright"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ flex: 1 }}>
            <h1>{t('title')}</h1>
          </div>
          <Dropdown as={ButtonGroup} variant="none" data-testid="togDrop">
            <div className={styles.profileContainer}>
              <div className={styles.imageContainer}>
                {userImage && userImage !== 'null' ? (
                  /*istanbul ignore next*/
                  <img src={userImage} alt={`profile picture`} />
                ) : (
                  <Avatar
                    size={45}
                    avatarStyle={styles.avatarStyle}
                    name={`${firstName} ${lastName}`}
                    alt={`dummy picture`}
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
            </div>
            <Dropdown.Toggle
              split
              variant="none"
              style={{ backgroundColor: 'white' }}
              id="dropdown-split-basic"
            />
            <Dropdown.Menu>
              <Dropdown.Item
                data-testid="profileBtn"
                onClick={() => navigate(`/member/${orgId}`)}
              >
                View Profile
              </Dropdown.Item>
              <Dropdown.Item
                style={{ color: 'red' }}
                onClick={logout}
                data-testid="logoutBtn"
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default OrganizationScreen;

const map: any = {
  orgdash: 'dashboard',
  orgpeople: 'organizationPeople',
  orgads: 'advertisement',
  member: 'memberDetail',
  orgevents: 'organizationEvents',
  orgactionitems: 'organizationActionItems',
  orgcontribution: 'orgContribution',
  orgpost: 'orgPost',
  orgfunds: 'funds',
  orgfundcampaign: 'fundCampaign',
  orgsetting: 'orgSettings',
  orgstore: 'addOnStore',
  blockuser: 'blockUnblockUser',
  event: 'blockUnblockUser',
};
