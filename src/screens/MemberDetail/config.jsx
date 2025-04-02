import TagIcon from 'assets/svgs/tag.svg?react';
import MemberOrganizationIcon from 'assets/svgs/memberOrganization.svg?react';
import MemberEvents from 'assets/svgs/memberEvents.svg?react';
import OverviewIcon from 'assets/svgs/overview.svg?react';

// Function to get navigation items
export const getNavItems = (t) => [
  {
    to: '/member',
    icon: <OverviewIcon />, // ✅ JSX element
    label: t('navigationOverview'),
  },
  {
    to: '/orgList',
    icon: <MemberOrganizationIcon />,
    label: t('navigationOrganizations'),
  },
  {
    to: '/orgevents',
    icon: <MemberEvents />,
    label: t('navigationEvents'),
  },
  {
    to: '/orgtags',
    icon: <TagIcon />,
    label: t('navigationTags'),
  },
];
