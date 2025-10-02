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
