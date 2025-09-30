/**
 * Dashboard cards component for displaying organization statistics.
 * Renders interactive cards showing member, admin, event, post, blocked user, and venue counts.
 */
import React from 'react';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AdminsIcon from 'assets/svgs/admin.svg?react';
import BlockedUsersIcon from 'assets/svgs/blockedUser.svg?react';
import EventsIcon from 'assets/svgs/events.svg?react';
import PostsIcon from 'assets/svgs/post.svg?react';
import UsersIcon from 'assets/svgs/users.svg?react';
import VenuesIcon from 'assets/svgs/venues.svg?react';
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import DashboardCardLoading from 'components/OrganizationDashCards/Loader/DashboardCardLoading';

/**
 * Props interface for the dashboard cards component
 */
export interface InterfaceDashboardCardsProps {
  memberCount: number;
  adminCount: number;
  eventCount: number;
  blockedCount: number;
  venueCount: number;
  membershipRequestsCount: number;
  postsCount: number;
  postsLink: string;
  eventsLink: string;
  blockUserLink: string;
  requestLink: string;
  venuesLink: string;
  isLoading: boolean;
  navigate: (path: string) => void;
}

/**
 * Dashboard cards component that displays organization statistics in a grid layout.
 * Each card shows a metric with an icon and provides navigation to detailed views.
 *
 * @param props - Dashboard data and navigation links
 * @returns JSX.Element - The rendered dashboard cards grid
 */
export default function DashboardCards({
  memberCount,
  adminCount,
  eventCount,
  blockedCount,
  venueCount,
  membershipRequestsCount,
  postsCount,
  postsLink,
  eventsLink,
  blockUserLink,
  requestLink,
  venuesLink,
  isLoading,
  navigate,
}: InterfaceDashboardCardsProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  if (isLoading) {
    return (
      <>
        <DashboardCardLoading />
        <DashboardCardLoading />
        <DashboardCardLoading />
        <DashboardCardLoading />
        <DashboardCardLoading />
        <DashboardCardLoading />
      </>
    );
  }

  return (
    <>
      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="membersCount"
        onClick={(): void => {}}
      >
        <DashBoardCard
          count={memberCount}
          title={t('members')}
          icon={<UsersIcon />}
        />
      </Col>

      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="adminsCount"
        onClick={(): void => {}}
      >
        <DashBoardCard
          count={adminCount}
          title={t('admins')}
          icon={<AdminsIcon />}
        />
      </Col>

      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="postsCount"
        onClick={(): void => {
          navigate(postsLink);
        }}
      >
        <DashBoardCard
          count={postsCount}
          title={t('postsCount')}
          icon={<PostsIcon />}
        />
      </Col>

      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="eventsCount"
        onClick={(): void => {
          navigate(eventsLink);
        }}
      >
        <DashBoardCard
          count={eventCount}
          title={t('events')}
          icon={<EventsIcon />}
        />
      </Col>

      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="blockedUsersCount"
        onClick={(): void => {
          navigate(blockUserLink);
        }}
      >
        <DashBoardCard
          count={blockedCount}
          title={t('blockedUsers')}
          icon={<BlockedUsersIcon />}
        />
      </Col>

      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="membershipRequestsCount"
        onClick={(): void => {
          navigate(requestLink);
        }}
      >
        <DashBoardCard
          count={membershipRequestsCount}
          title={t('requests')}
          icon={<UsersIcon />}
        />
      </Col>

      <Col
        xs={6}
        sm={4}
        role="button"
        className="mb-4"
        data-testid="venuesCount"
        onClick={(): void => {
          navigate(venuesLink);
        }}
      >
        <DashBoardCard
          count={venueCount}
          title={t('venues')}
          icon={<VenuesIcon />}
        />
      </Col>
    </>
  );
}
