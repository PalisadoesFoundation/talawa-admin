import { QuestionMarkOutlined } from '@mui/icons-material';
import { ReactComponent as ActionItemIcon } from 'assets/svgs/actionItem.svg';
import { ReactComponent as BlockUserIcon } from 'assets/svgs/blockUser.svg';
import { ReactComponent as CheckInRegistrantsIcon } from 'assets/svgs/checkInRegistrants.svg';
import { ReactComponent as DashboardIcon } from 'assets/svgs/dashboard.svg';
import { ReactComponent as EventStatsIcon } from 'assets/svgs/eventStats.svg';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as FundsIcon } from 'assets/svgs/funds.svg';
import { ReactComponent as ListEventRegistrantsIcon } from 'assets/svgs/listEventRegistrants.svg';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as PeopleIcon } from 'assets/svgs/people.svg';
import { ReactComponent as PluginsIcon } from 'assets/svgs/plugins.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/posts.svg';
import { ReactComponent as SettingsIcon } from 'assets/svgs/settings.svg';
import { ReactComponent as VenueIcon } from 'assets/svgs/venues.svg';
import { ReactComponent as RequestsIcon } from 'assets/svgs/requests.svg';

import React from 'react';

export interface InterfaceIconComponent {
  name: string;
  fill?: string;
  height?: string;
  width?: string;
}

const iconComponent = (props: InterfaceIconComponent): JSX.Element => {
  switch (props.name) {
    case 'My Organizations':
      return (
        <OrganizationsIcon
          stroke={props.fill}
          data-testid="Icon-Component-MyOrganizationsIcon"
        />
      );
    case 'Dashboard':
      return (
        <DashboardIcon {...props} data-testid="Icon-Component-DashboardIcon" />
      );
    case 'People':
      return <PeopleIcon {...props} data-testid="Icon-Component-PeopleIcon" />;
    case 'Requests':
      return (
        <RequestsIcon {...props} data-testid="Icon-Component-RequestsIcon" />
      );
    case 'Events':
      return <EventsIcon {...props} data-testid="Icon-Component-EventsIcon" />;
    case 'Action Items':
      return (
        <ActionItemIcon
          {...props}
          data-testid="Icon-Component-ActionItemIcon"
        />
      );
    case 'Posts':
      return <PostsIcon {...props} data-testid="Icon-Component-PostsIcon" />;
    case 'Block/Unblock':
      return (
        <BlockUserIcon
          {...props}
          data-testid="Block/Icon-Component-UnblockIcon"
        />
      );
    case 'Plugins':
      return (
        <PluginsIcon
          stroke={props.fill}
          data-testid="Icon-Component-PluginsIcon"
        />
      );
    case 'Settings':
      return (
        <SettingsIcon
          stroke={props.fill}
          data-testid="Icon-Component-SettingsIcon"
        />
      );
    case 'List Event Registrants':
      return (
        <ListEventRegistrantsIcon
          data-testid="Icon-Component-List-Event-Registrants"
          stroke={props.fill}
        />
      );
    case 'Check In Registrants':
      return (
        <CheckInRegistrantsIcon
          data-testid="Icon-Component-Check-In-Registrants"
          stroke={props.fill}
        />
      );
    case 'Event Stats':
      return (
        <EventStatsIcon
          data-testid="Icon-Component-Event-Stats"
          stroke={props.fill}
        />
      );
    case 'Advertisement':
      return (
        <PostsIcon
          data-testid="Icon-Component-Advertisement"
          stroke={props.fill}
        />
      );
    case 'Funds':
      return (
        <FundsIcon data-testid="Icon-Component-Funds" stroke={props.fill} />
      );
    case 'Venues':
      return (
        <VenueIcon data-testid="Icon-Component-Venues" stroke={props.fill} />
      );
    default:
      return (
        <QuestionMarkOutlined
          {...props}
          data-testid="Icon-Component-DefaultIcon"
        />
      );
  }
};

export default iconComponent;
