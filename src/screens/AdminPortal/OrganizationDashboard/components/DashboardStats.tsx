/**
 * Dashboard statistics component for displaying organization metrics and navigation.
 *
 * This component renders a comprehensive dashboard showing key organizational statistics
 * including member counts, admin counts, event counts, venue counts, blocked user counts,
 * and post counts. Each statistic is displayed as a clickable card that provides navigation
 * to the respective detailed view. The component supports loading states and handles
 * various click interactions through callback functions.
 *
 * @param memberCount - The total number of members in the organization.
 * @param adminCount - The total number of administrators in the organization.
 * @param eventCount - The total number of events in the organization.
 * @param venueCount - The total number of venues in the organization.
 * @param blockedCount - The total number of blocked users in the organization.
 * @param postsCount - The total number of posts in the organization. Optional.
 * @param isLoading - Loading state indicator. When true, shows skeleton loaders instead of actual counts.
 * @param onMembersClick - Callback function triggered when the members statistics card is clicked.
 * @param onAdminsClick - Callback function triggered when the admins statistics card is clicked.
 * @param onPostsClick - Callback function triggered when the posts statistics card is clicked.
 * @param onEventsClick - Callback function triggered when the events statistics card is clicked.
 * @param onVenuesClick - Callback function triggered when the venues statistics card is clicked.
 * @param onBlockedUsersClick - Callback function triggered when the blocked users statistics card is clicked.
 *
 * @returns A JSX element containing a grid layout with six clickable dashboard cards displaying organization statistics.
 *
 * @example
 * ```tsx
 * <DashboardStats
 *   memberCount={150}
 *   adminCount={5}
 *   eventCount={12}
 *   venueCount={3}
 *   blockedCount={2}
 *   postsCount={45}
 *   isLoading={false}
 *   onMembersClick={() => navigate('/members')}
 *   onAdminsClick={() => navigate('/admins')}
 *   onPostsClick={() => navigate('/posts')}
 *   onEventsClick={() => navigate('/events')}
 *   onVenuesClick={() => navigate('/venues')}
 *   onBlockedUsersClick={() => navigate('/blocked-users')}
 * />
 * ```
 *
 * @remarks
 * - The component uses react-icons for displaying appropriate icons on each statistics card.
 * - Cards are styled with hover effects and click animations for better user experience.
 * - During loading state, skeleton components are displayed to maintain layout consistency.
 * - The component is fully responsive and adapts to different screen sizes using Bootstrap grid system.
 * - All callback functions are asynchronous to support navigation and API calls.
 *
 */

import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AdminsIcon from 'assets/svgs/admin.svg?react';
import BlockedUsersIcon from 'assets/svgs/blockedUser.svg?react';
import EventsIcon from 'assets/svgs/events.svg?react';
import PostsIcon from 'assets/svgs/post.svg?react';
import UsersIcon from 'assets/svgs/users.svg?react';
import VenuesIcon from 'assets/svgs/venues.svg?react';
import DashBoardCard from 'components/AdminPortal/OrganizationDashCards/DashboardCard';
import DashboardCardLoading from 'components/AdminPortal/OrganizationDashCards/Loader/DashboardCardLoading';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import styles from './DashboardStats.module.css';

interface InterfaceDashboardStatsProps {
  memberCount: number;
  adminCount: number;
  eventCount: number;
  venueCount: number;
  blockedCount: number;
  postsCount?: number;
  isLoading: boolean;
  onMembersClick: () => Promise<void>;
  onAdminsClick: () => Promise<void>;
  onPostsClick: () => Promise<void>;
  onEventsClick: () => Promise<void>;
  onVenuesClick: () => Promise<void>;
  onBlockedUsersClick: () => Promise<void>;
}

const DashboardStats: React.FC<InterfaceDashboardStatsProps> = ({
  memberCount,
  adminCount,
  eventCount,
  venueCount,
  blockedCount,
  postsCount,
  isLoading,
  onMembersClick,
  onAdminsClick,
  onPostsClick,
  onEventsClick,
  onVenuesClick,
  onBlockedUsersClick,
}) => {
  const { t: tCommon } = useTranslation('common');

  return (
    <LoadingState
      isLoading={isLoading}
      variant="custom"
      customLoader={
        <Row className={styles.flex}>
          {[...Array(6)].map((_, index) => (
            <Col
              xs={6}
              sm={4}
              className="mb-4"
              key={`orgLoading_${index}`}
              data-testid="fallback-ui"
            >
              <DashboardCardLoading />
            </Col>
          ))}
        </Row>
      }
    >
      <Row className={styles.flex}>
        <Col xs={6} sm={4} className="mb-4">
          <button
            type="button"
            className="p-0 m-0 border-0 bg-transparent w-100 text-start"
            data-testid="membersCount"
            onClick={onMembersClick}
            aria-label={tCommon('members')}
          >
            <DashBoardCard
              count={memberCount}
              title={tCommon('members')}
              icon={<UsersIcon className={styles.iconGrey} />}
            />
          </button>
        </Col>
        <Col xs={6} sm={4} className="mb-4">
          <button
            type="button"
            className="p-0 m-0 border-0 bg-transparent w-100 text-start"
            data-testid="adminsCount"
            onClick={onAdminsClick}
            aria-label={tCommon('admins')}
          >
            <DashBoardCard
              count={adminCount}
              title={tCommon('admins')}
              icon={<AdminsIcon className={styles.iconGrey} />}
            />
          </button>
        </Col>
        <Col xs={6} sm={4} className="mb-4">
          <button
            type="button"
            className="p-0 m-0 border-0 bg-transparent w-100 text-start"
            data-testid="postsCount"
            onClick={onPostsClick}
            aria-label={tCommon('posts')}
          >
            <DashBoardCard
              count={postsCount ?? 0}
              title={tCommon('posts')}
              icon={<PostsIcon className={styles.iconGrey} />}
            />
          </button>
        </Col>
        <Col xs={6} sm={4} className="mb-4">
          <button
            type="button"
            className="p-0 m-0 border-0 bg-transparent w-100 text-start"
            data-testid="eventsCount"
            onClick={onEventsClick}
            aria-label={tCommon('events')}
          >
            <DashBoardCard
              count={eventCount}
              title={tCommon('events')}
              icon={<EventsIcon className={styles.iconGrey} />}
            />
          </button>
        </Col>
        <Col xs={6} sm={4} className="mb-4">
          <button
            type="button"
            className="p-0 m-0 border-0 bg-transparent w-100 text-start"
            data-testid="blockedUsersCount"
            onClick={onBlockedUsersClick}
            aria-label={tCommon('blockedUsers')}
          >
            <DashBoardCard
              count={blockedCount}
              title={tCommon('blockedUsers')}
              icon={<BlockedUsersIcon className={styles.iconGrey} />}
            />
          </button>
        </Col>
        <Col xs={6} sm={4} className="mb-4">
          <button
            type="button"
            className="p-0 m-0 border-0 bg-transparent w-100 text-start"
            data-testid="venuesCount"
            onClick={onVenuesClick}
            aria-label={tCommon('venues')}
          >
            <DashBoardCard
              count={venueCount}
              title={tCommon('venues')}
              icon={<VenuesIcon className={styles.iconGrey} />}
            />
          </button>
        </Col>
      </Row>
    </LoadingState>
  );
};

export default DashboardStats;
