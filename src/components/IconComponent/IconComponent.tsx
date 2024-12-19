import {
  QuestionMarkOutlined,
  ContactPageOutlined,
  NewspaperOutlined,
} from '@mui/icons-material';
import ActionItemIcon from 'assets/svgs/actionItem.svg?react';
import BlockUserIcon from 'assets/svgs/blockUser.svg?react';
import CheckInRegistrantsIcon from 'assets/svgs/checkInRegistrants.svg?react';
import DashboardIcon from 'assets/svgs/dashboard.svg?react';
import EventsIcon from 'assets/svgs/events.svg?react';
import FundsIcon from 'assets/svgs/funds.svg?react';
import ListEventRegistrantsIcon from 'assets/svgs/listEventRegistrants.svg?react';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import PeopleIcon from 'assets/svgs/people.svg?react';
import TagsIcon from 'assets/svgs/tags.svg?react';
import TagIcon from 'assets/svgs/tag.svg?react';
import PluginsIcon from 'assets/svgs/plugins.svg?react';
import PostsIcon from 'assets/svgs/posts.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import VenueIcon from 'assets/svgs/venues.svg?react';
import RequestsIcon from 'assets/svgs/requests.svg?react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { MdOutlineVolunteerActivism } from 'react-icons/md';

import React from 'react';

export interface InterfaceIconComponent {
  name: string;
  fill?: string;
  height?: string;
  width?: string;
}
/**
 * Renders an icon based on the provided name.
 *
 * @param props - Contains the name of the icon and optional styles (fill, height, width).
 * @returns JSX element representing the icon.
 */
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
    case 'Tags':
      return <TagsIcon {...props} data-testid="Icon-Component-TagsIcon" />;
    case 'Tag':
      return <TagIcon {...props} data-testid="Icon-Component-TagIcon" />;
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
    case 'Donate':
      return (
        <FundsIcon data-testid="Icon-Component-Donate" stroke={props.fill} />
      );
    case 'Campaigns':
      return (
        <NewspaperOutlined {...props} data-testid="Icon-Component-Campaigns" />
      );
    case 'My Pledges':
      return (
        <ContactPageOutlined
          data-testid="Icon-Component-My-Pledges"
          stroke={props.fill}
        />
      );
    case 'Leave Organization':
      return (
        <ExitToAppIcon
          data-testid="Icon-Component-Leave-Organization"
          stroke={props.fill}
        />
      );
    case 'Volunteer':
      return (
        <MdOutlineVolunteerActivism
          fill={props.fill}
          height={props.height}
          width={props.width}
          data-testid="Icon-Component-Volunteer"
        />
      );
    default:
      return (
        <QuestionMarkOutlined
          {...props}
          fontSize="large"
          data-testid="Icon-Component-DefaultIcon"
        />
      );
  }
};

export default iconComponent;
