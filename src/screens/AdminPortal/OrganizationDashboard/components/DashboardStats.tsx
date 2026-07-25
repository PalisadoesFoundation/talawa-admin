/**
 * Dashboard statistics — renders stat cards matching the prototype exactly.
 * Uses global design system classes (stat-card, stat-card-top, etc.)
 * instead of CSS modules.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

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

  const stats = [
    {
      label: tCommon('members'),
      count: memberCount,
      icon: 'green',
      onClick: onMembersClick,
      testId: 'membersCount',
      iconSvg: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: tCommon('admins'),
      count: adminCount,
      icon: 'purple',
      onClick: onAdminsClick,
      testId: 'adminsCount',
      iconSvg: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: tCommon('events'),
      count: eventCount,
      icon: 'orange',
      onClick: onEventsClick,
      testId: 'eventsCount',
      iconSvg: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
    },
    {
      label: tCommon('posts'),
      count: postsCount ?? 0,
      icon: 'blue',
      onClick: onPostsClick,
      testId: 'postsCount',
      iconSvg: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      label: tCommon('venues'),
      count: venueCount,
      icon: 'yellow',
      onClick: onVenuesClick,
      testId: 'venuesCount',
      iconSvg: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: tCommon('blockedUsers'),
      count: blockedCount,
      icon: 'red',
      onClick: onBlockedUsersClick,
      testId: 'blockedUsersCount',
      iconSvg: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="stats-grid">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="stat-card"
            data-testid="fallback-ui"
            style={{ minHeight: 120 }}
          >
            <div
              style={{
                height: 14,
                width: '40%',
                background: 'var(--gray-200)',
                borderRadius: 4,
                marginBottom: 16,
              }}
            />
            <div
              style={{
                height: 28,
                width: '30%',
                background: 'var(--gray-100)',
                borderRadius: 4,
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <button
          key={stat.testId}
          className="stat-card"
          data-testid={stat.testId}
          onClick={stat.onClick}
          aria-label={stat.label}
          style={{ border: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          <div className="stat-card-top">
            <span className="stat-card-label">{stat.label}</span>
            <div className={`stat-card-icon ${stat.icon}`}>{stat.iconSvg}</div>
          </div>
          <div className="stat-card-value">{stat.count}</div>
        </button>
      ))}
    </div>
  );
};

export default DashboardStats;
