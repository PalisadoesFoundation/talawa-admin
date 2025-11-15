/**
 * MemberDetail Component
 *
 * Admin portal component for viewing and managing user details.
 * Uses the unified UserProfile component for consistent UI across admin and user portals.
 *
 * @component
 * @param {MemberDetailProps} props - The props for the component.
 * @param {string} [props.id] - Optional member ID to fetch and display details.
 *
 * @returns {JSX.Element} The rendered MemberDetail component.
 *
 * @remarks
 * - Renders UserProfile with isAdminView=true (tabs: Overview, Organizations, Events, Tags)
 * - Prioritizes real backend data; shows demo data only on error/unavailable
 */
import React from 'react';
import { useLocation } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import UserProfile from 'components/UserProfile/UserProfile';
import styles from './MemberDetail.module.css';

type MemberDetailProps = { id?: string };

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const currentUserId = location.state?.id || id || getItem('id');

  return (
    <div className={styles.memberDetailContainer}>
      <UserProfile
        userId={currentUserId}
        isOwnProfile={false}
        isAdminView={true}
      />
    </div>
  );
};

export default MemberDetail;
