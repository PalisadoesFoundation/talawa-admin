/**
 * The `Settings` component is a user profile settings page that allows users to
 * view and update their personal information, including profile picture, contact
 * details, and other settings. It also includes responsive behavior for different
 * screen sizes.
 *
 * @remarks
 * - Utilizes Apollo Client for GraphQL queries and mutations.
 * - Includes form validation for fields like password strength and file upload restrictions.
 * - Provides a responsive layout with a collapsible sidebar.
 * - Displays toast notifications for success and error messages.
 *
 * ### Requirements
 * - `react`, `react-i18next` for translations.
 * - `react-bootstrap` for UI components.
 * - `@apollo/client` for GraphQL integration.
 * - `react-toastify` for toast notifications.
 * - Custom utilities like `useLocalStorage`, `urlToFile`, and `validatePassword`.
 *
 * ### Internal Details
 * - Handles window resize events to toggle the sidebar visibility.
 * - Fetches current user data using the `CURRENT_USER` query.
 * - Updates user details using the `UPDATE_CURRENT_USER_MUTATION` mutation.
 * - TODO: Integrate `EventsAttendedByUser` component once event queries are functional.
 *
 * @returns A JSX.Element representing the rendered settings page.
 *
 * @example
 * ```tsx
 * <Settings />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { Col, Row } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import UserProfile from 'components/UserProfile/UserProfile';

export default function Settings(): React.JSX.Element {
  const { t: tCommon } = useTranslation('common');
  const { getItem, setItem } = useLocalStorage();
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth <= 820) {
        setHideDrawer(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync hideDrawer state changes to localStorage using the hook
  useEffect(() => {
    setItem('sidebar', hideDrawer.toString());
  }, [hideDrawer, setItem]);

  // Query to check if user is logged in - but don't block UI on error
  // UserProfile component will handle errors and show demo data
  const { loading } = useQuery(CURRENT_USER, {
    errorPolicy: 'all', // Don't throw errors, let component handle them
  });

  // Only show loading on initial load
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`d-flex flex-row ${styles.containerHeight} ${
          hideDrawer ? styles.expand : styles.contract
        }`}
        style={{
          marginLeft: hideDrawer ? '100px' : '20px',
          paddingTop: '10px',
        }}
      >
        <div className={styles.mainContainer}>
          <ProfileHeader title={tCommon('settings')} />
          <Row>
            <Col lg={12}>
              <UserProfile isOwnProfile={true} isAdminView={false} />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
