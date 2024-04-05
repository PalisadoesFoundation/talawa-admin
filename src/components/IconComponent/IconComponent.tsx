<<<<<<< HEAD
import { QuestionMarkOutlined } from '@mui/icons-material';
import { ReactComponent as ActionItemIcon } from 'assets/svgs/actionItem.svg';
import { ReactComponent as BlockUserIcon } from 'assets/svgs/blockUser.svg';
import { ReactComponent as CheckInRegistrantsIcon } from 'assets/svgs/checkInRegistrants.svg';
import { ReactComponent as DashboardIcon } from 'assets/svgs/dashboard.svg';
import { ReactComponent as EventStatsIcon } from 'assets/svgs/eventStats.svg';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as FundsIcon } from 'assets/svgs/funds.svg';
import { ReactComponent as ListEventRegistrantsIcon } from 'assets/svgs/listEventRegistrants.svg';
=======
import React from 'react';
import { QuestionMarkOutlined } from '@mui/icons-material';
import { ReactComponent as BlockUserIcon } from 'assets/svgs/blockUser.svg';
import { ReactComponent as DashboardIcon } from 'assets/svgs/dashboard.svg';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as PeopleIcon } from 'assets/svgs/people.svg';
import { ReactComponent as PluginsIcon } from 'assets/svgs/plugins.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/posts.svg';
import { ReactComponent as SettingsIcon } from 'assets/svgs/settings.svg';
<<<<<<< HEAD
import { ReactComponent as VenueIcon } from 'assets/svgs/venues.svg';
import React from 'react';
=======
import { ReactComponent as AddEventProjectIcon } from 'assets/svgs/addEventProject.svg';
import { ReactComponent as ListEventRegistrantsIcon } from 'assets/svgs/listEventRegistrants.svg';
import { ReactComponent as CheckInRegistrantsIcon } from 'assets/svgs/checkInRegistrants.svg';
import { ReactComponent as EventStatsIcon } from 'assets/svgs/eventStats.svg';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

export interface InterfaceIconComponent {
  name: string;
  fill?: string;
  height?: string;
  width?: string;
}

const iconComponent = (props: InterfaceIconComponent): JSX.Element => {
  switch (props.name) {
<<<<<<< HEAD
    case 'My Organizations':
      return (
        <OrganizationsIcon
          stroke={props.fill}
          data-testid="Icon-Component-MyOrganizationsIcon"
        />
      );
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    case 'Dashboard':
      return (
        <DashboardIcon {...props} data-testid="Icon-Component-DashboardIcon" />
      );
    case 'People':
      return <PeopleIcon {...props} data-testid="Icon-Component-PeopleIcon" />;
    case 'Events':
      return <EventsIcon {...props} data-testid="Icon-Component-EventsIcon" />;
<<<<<<< HEAD
    case 'Action Items':
      return (
        <ActionItemIcon
          {...props}
          data-testid="Icon-Component-ActionItemIcon"
        />
      );
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======
    case 'All Organizations':
      return (
        <OrganizationsIcon
          stroke={props.fill}
          data-testid="Icon-Component-AllOrganizationsIcon"
        />
      );
    case 'Add Event Project':
      return (
        <AddEventProjectIcon
          data-testid="Icon-Component-Add-Event-Project"
          stroke={props.fill}
        />
      );
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
      return <PostsIcon stroke={props.fill} />;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
