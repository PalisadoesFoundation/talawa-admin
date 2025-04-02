import TagIcon from 'assets/svgs/tag.svg?react';
import MemberOrganizationIcon from 'assets/svgs/memberOrganization.svg?react';
import MemberEvents from 'assets/svgs/memberEvents.svg?react';
import OverviewIcon from 'assets/svgs/overview.svg?react';

/**
 * Returns navigation items for the member detail screen
 * @param {function} t - Translation function
 * @returns {Array} Array of navigation item objects with route, icon, and label
 */

export const getNavItems = (t) => [

  {
    to: '/member',
    icon: <OverviewIcon />, 
    label: t('navigationOverview'),
  },
  {
    to: '/member/orgList',
    icon: <MemberOrganizationIcon />,
    label: t('navigationOrganizations'),
  },
  {
    to: '/member/orgevents',
    icon: <MemberEvents />,
    label: t('navigationEvents'),
  },
  {
    to: '/member/orgtags',
    icon: <TagIcon />,
    label: t('navigationTags'),
  },
];
