/**
 * DashboardStats Component
 *
 * This component renders dashboard statistics cards displaying organization metrics
 * including member count, admin count, event count, venue count, blocked users count,
 * and posts count. It provides navigation functionality for each statistic.
 *
 * @param props - The properties object for the component.
 * @param props.memberCount - Number of members in the organization.
 * @param props.adminCount - Number of administrators in the organization.
 * @param props.eventCount - Number of events in the organization.
 * @param props.venueCount - Number of venues in the organization.
 * @param props.blockedCount - Number of blocked users in the organization.
 * @param props.postsCount - Optional number of posts in the organization.
 * @param props.isLoading - Boolean indicating if data is currently loading.
 * @param props.onPostsClick - Callback function triggered when posts card is clicked.
 * @param props.onMembersClick - Callback function triggered when members card is clicked.
 * @param props.onAdminsClick - Callback function triggered when admins card is clicked.
 * @param props.onBlockedUsersClick - Callback function triggered when blocked users card is clicked.
 * @param props.onEventsClick - Callback function triggered when events card is clicked.
 * @param props.onVenuesClick - Callback function triggered when venues card is clicked.
 *
 * @returns A JSX.Element containing dashboard statistics cards with navigation functionality.
 *
 * @remarks
 * - Uses DashBoardCard components for consistent styling across all statistics.
 * - Displays loading state when data is being fetched.
 * - Provides clickable cards that trigger navigation callbacks.
 * - Uses SVG icons for visual representation of each statistic type.
 *
 * @example
 * ```tsx
 * <DashboardStats
 *   memberCount={150}
 *   adminCount={5}
 *   eventCount={25}
 *   venueCount={8}
 *   blockedCount={2}
 *   postsCount={100}
 *   isLoading={false}
 *   onPostsClick={() => navigate('/posts')}
 *   onMembersClick={() => navigate('/members')}
 *   // ... other click handlers
 * />
 * ```
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
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import DashboardCardLoading from 'components/OrganizationDashCards/Loader/DashboardCardLoading';

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
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationDashboard',
  });
  const { t: tCommon } = useTranslation('common');

  if (isLoading) {
    return (
      <Row style={{ display: 'flex' }}>
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
    );
  }

  return (
    <Row style={{ display: 'flex' }}>
      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="membersCount"
        onClick={onMembersClick}
      >
        <DashBoardCard
          count={memberCount}
          title={tCommon('members')}
          icon={<UsersIcon fill="#555555" />}
        />
      </Col>
      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="adminsCount"
        onClick={onAdminsClick}
      >
        <DashBoardCard
          count={adminCount}
          title={tCommon('admins')}
          icon={<AdminsIcon fill="#555555" />}
        />
      </Col>
      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="postsCount"
        onClick={onPostsClick}
      >
        <DashBoardCard
          count={postsCount}
          title={t('posts')}
          icon={<PostsIcon fill="#555555" />}
        />
      </Col>
      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="eventsCount"
        onClick={onEventsClick}
      >
        <DashBoardCard
          count={eventCount}
          title={t('events')}
          icon={<EventsIcon fill="#555555" />}
        />
      </Col>
      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="venuesCount"
        onClick={onVenuesClick}
      >
        <DashBoardCard
          count={venueCount}
          title={t('venues')}
          icon={<VenuesIcon fill="#555555" />}
        />
      </Col>
      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="blockedUsersCount"
        onClick={onBlockedUsersClick}
      >
        <DashBoardCard
          count={blockedCount}
          title={t('blockedUsers')}
          icon={<BlockedUsersIcon fill="#555555" />}
        />
      </Col>
    </Row>
  );
};

export default DashboardStats;
