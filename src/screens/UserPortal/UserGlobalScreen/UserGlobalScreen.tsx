/**
 * Main layout for user routes that do not require an orgId.
 * Manages sidebar visibility and displays nested content via the router outlet.
 *
 * @returns JSX.Element The rendered UserGlobalScreen component.
 *
 * @remarks
 * - Uses UserSidebar instead of UserSidebarOrg because no orgId is needed.
 * - Hides the sidebar on narrow screens and shows it on wider screens.
 * - Provides a profile dropdown alongside the page title area.
 *
 * @example
 * ```tsx
 * <Route path="/user/test/global" element={<UserGlobalScreen />} />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './UserGlobalScreen.module.css';
import { Button } from 'shared-components/Button';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import DropDownButton from 'shared-components/DropDownButton';
import useUserProfile from 'hooks/useUserProfile';
import Avatar from 'shared-components/Avatar/Avatar';

const UserGlobalScreen = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userGlobalScreen',
  });
  const [hideDrawer, setHideDrawer] = useState<boolean>(false);
  const {
    name,
    displayedName,
    userRole,
    userImage,
    profileDestination,
    handleLogout,
    tCommon,
  } = useUserProfile('user');

  const navigate = useNavigate();

  /**
   * Handles window resize events to toggle the sidebar visibility
   * based on the screen width.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true); // Hide on mobile
    } else {
      setHideDrawer(false); // Show on desktop
    }
  };

  // Set up event listener for window resize and clean up on unmount
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {hideDrawer ? (
        <Button
          className={styles.opendrawer}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="openMenu"
        >
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      ) : (
        <Button
          className={styles.collapseSidebarButton}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="closeMenu"
        >
          <i className="fa fa-angle-double-left" aria-hidden="true"></i>
        </Button>
      )}
      <div className={styles.drawer}>
        <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      </div>
      <div
        className={`${styles.pageContainer} ${
          hideDrawer ? styles.expand : styles.contract
        } `}
        data-testid="mainpageright"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className={styles.titleFlex}>
            <h1>{t('globalFeatures')}</h1>
          </div>
          <DropDownButton
            id="user-profile-dropdown"
            options={[
              {
                value: 'viewProfile',
                label: tCommon('viewProfile'),
              },
              {
                value: 'logout',
                label: (
                  <span className={styles.logoutBtn}>{tCommon('logout')}</span>
                ),
              },
            ]}
            onSelect={(eventKey) => {
              switch (eventKey) {
                case 'viewProfile':
                  navigate(profileDestination);
                  break;
                case 'logout':
                  handleLogout();
                  break;
                default:
                  break;
              }
            }}
            icon={
              <div className={styles.profileContainer}>
                <div className={styles.imageContainer}>
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={tCommon('profilePicture')}
                      data-testid="display-img"
                      crossOrigin="anonymous"
                      className={styles.profileImage}
                    />
                  ) : (
                    <Avatar
                      avatarStyle={styles.profileImage}
                      containerStyle={styles.imageContainer}
                      dataTestId="display-img"
                      size={45}
                      name={name}
                      alt={tCommon('profilePicturePlaceholder')}
                    />
                  )}
                </div>
                <div className={styles.profileText}>
                  <span
                    className={styles.profileName}
                    data-testid="display-name"
                  >
                    {displayedName}
                  </span>
                  <span
                    className={styles.profileRole}
                    data-testid="display-type"
                  >
                    {userRole}
                  </span>
                </div>
              </div>
            }
            ariaLabel={tCommon('userProfileMenu')}
            dataTestIdPrefix="profile"
            btnStyle={styles.profileDropdownBtn}
            variant="light"
            menuClassName={styles.profileDropdownMenu}
            showCaret={false}
          />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default UserGlobalScreen;
