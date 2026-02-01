/**
 * IconComponent - A React functional component that renders various icons
 * based on the provided `name` prop. The component supports both SVG icons
 * and Material-UI icons, along with customizable properties such as `fill`,
 * `height`, and `width`.
 *
 * @remarks
 * This component is designed to dynamically render icons based on the `name`
 * prop. It supports a wide range of icons, including organization-related,
 * dashboard, people, events, and more. If the `name` prop does not match any
 * predefined case, a default "Question Mark" icon is rendered.
 *
 * @param props - Object containing the properties for the IconComponent:
 * - `name`: The name of the icon to render.
 * - `fill`: (Optional) The fill color for the icon (used for SVG icons).
 * - `height`: (Optional) The height of the icon (used for SVG icons).
 * - `width`: (Optional) The width of the icon (used for SVG icons).
 *
 * @returns A JSX element representing the requested icon.
 *
 * @example
 * ```tsx
 * <IconComponent name="Dashboard" fill="#000" />
 * <IconComponent name="Volunteer" height="24px" width="24px" />
 * ```
 *
 * @defaultValue
 * If the `name` prop does not match any case, a default "Question Mark" icon
 * is rendered with a large font size.
 *
 */
import {
  QuestionMarkOutlined,
  ContactPageOutlined,
  NewspaperOutlined,
} from '@mui/icons-material';
import ActionItemIcon from 'assets/svgs/actionItem.svg?react';
import React from 'react';
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
import PostsIcon from 'assets/svgs/posts.svg?react';
import ChatIcon from 'assets/svgs/chat.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import VenueIcon from 'assets/svgs/venues.svg?react';
import RequestsIcon from 'assets/svgs/requests.svg?react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { MdOutlineVolunteerActivism } from 'react-icons/md';
import { InterfaceIconComponentProps } from 'types/shared-components/IconComponent/interface';

import type { JSX } from 'react';

const IconComponent = ({
  name,
  fill,
  height,
  width,
}: InterfaceIconComponentProps): JSX.Element => {
  switch (name) {
    case 'ActionItem':
      return (
        <ActionItemIcon
          stroke={fill}
          data-testid="Icon-Component-ActionItemIcon"
        />
      );

    case 'My Organizations':
      return (
        <OrganizationsIcon
          stroke={fill}
          data-testid="Icon-Component-MyOrganizationsIcon"
        />
      );

    case 'Dashboard':
      return (
        <DashboardIcon
          fill={fill}
          height={height}
          width={width}
          data-testid="Icon-Component-DashboardIcon"
        />
      );

    case 'People':
      return (
        <PeopleIcon
          fill={fill}
          height={height}
          width={width}
          data-testid="Icon-Component-PeopleIcon"
        />
      );

    case 'Tags':
      return (
        <TagsIcon
          fill={fill}
          height={height}
          width={width}
          data-testid="Icon-Component-TagsIcon"
        />
      );

    case 'Tag':
      return (
        <TagIcon
          fill={fill}
          height={height}
          width={width}
          data-testid="Icon-Component-TagIcon"
        />
      );

    case 'Chat':
      return (
        <ChatIcon
          fill={fill}
          height={height}
          width={width}
          data-testid="Icon-Component-ChatIcon"
        />
      );

    case 'Requests':
      return (
        <RequestsIcon
          width={20}
          height={20}
          fill={fill || 'currentColor'}
          data-testid="Icon-Component-RequestsIcon"
        />
      );

    case 'Events':
      return (
        <EventsIcon
          fill={fill}
          height={height}
          width={width}
          data-testid="Icon-Component-EventsIcon"
        />
      );

    case 'Posts':
      return (
        <PostsIcon
          fill={fill}
          height={height}
          width={width}
          data-testid="Icon-Component-PostsIcon"
        />
      );

    case 'Block/Unblock':
      return (
        <BlockUserIcon
          fill={fill}
          height={height}
          width={width}
          data-testid="Block/Icon-Component-UnblockIcon"
        />
      );

    case 'Settings':
      return (
        <SettingsIcon stroke={fill} data-testid="Icon-Component-SettingsIcon" />
      );

    case 'List Event Registrants':
      return (
        <ListEventRegistrantsIcon
          stroke={fill}
          data-testid="Icon-Component-List-Event-Registrants"
        />
      );

    case 'Check In Registrants':
      return (
        <CheckInRegistrantsIcon
          stroke={fill}
          data-testid="Icon-Component-Check-In-Registrants"
        />
      );

    case 'Advertisement':
      return (
        <PostsIcon stroke={fill} data-testid="Icon-Component-Advertisement" />
      );

    case 'Funds':
      return <FundsIcon stroke={fill} data-testid="Icon-Component-Funds" />;

    case 'Donate':
      return <FundsIcon stroke={fill} data-testid="Icon-Component-Donate" />;

    case 'Transactions':
      return (
        <FundsIcon stroke={fill} data-testid="Icon-Component-Transactions" />
      );

    case 'Venues':
      return <VenueIcon stroke={fill} data-testid="Icon-Component-Venues" />;

    case 'Campaigns':
      return (
        <NewspaperOutlined
          sx={{ color: fill || 'currentColor' }}
          data-testid="Icon-Component-Campaigns"
        />
      );

    case 'My Pledges':
      return (
        <ContactPageOutlined
          sx={{ color: fill || 'currentColor' }}
          data-testid="Icon-Component-My-Pledges"
        />
      );

    case 'Leave Organization':
      return (
        <ExitToAppIcon
          sx={{ color: fill || 'currentColor' }}
          data-testid="Icon-Component-Leave-Organization"
        />
      );

    case 'Volunteer':
      return (
        <MdOutlineVolunteerActivism
          fill={fill}
          height={height}
          width={width}
          data-testid="Icon-Component-Volunteer"
        />
      );

    default:
      return (
        <QuestionMarkOutlined
          fontSize="large"
          data-testid="Icon-Component-DefaultIcon"
        />
      );
  }
};

export default IconComponent;
