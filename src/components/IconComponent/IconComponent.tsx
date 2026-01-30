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
 * <IconComponent name="dashboard" fill="#000" />
 * <IconComponent name="volunteer" height="24px" width="24px" />
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

import type { JSX } from 'react';

import type { InterfaceIconComponentProps } from 'types/shared-components/IconComponent/interface';

import styles from './IconComponent.module.css';

const IconComponent = ({
  name,
  fill,
  height,
  width,
  ...rest
}: InterfaceIconComponentProps): JSX.Element => {
  switch (name) {
    case 'actionItems':
      return (
        <ActionItemIcon
          stroke={fill}
          data-testid="Icon-Component-ActionItemIcon"
        />
      );
    case 'myOrganizations':
      return (
        <OrganizationsIcon
          stroke={fill}
          data-testid="Icon-Component-MyOrganizationsIcon"
        />
      );
    case 'dashboard':
      return (
        <DashboardIcon {...rest} data-testid="Icon-Component-DashboardIcon" />
      );
    case 'people':
      return <PeopleIcon {...rest} data-testid="Icon-Component-PeopleIcon" />;
    case 'tags':
      return <TagsIcon {...rest} data-testid="Icon-Component-TagsIcon" />;
    case 'tag':
      return <TagIcon {...rest} data-testid="Icon-Component-TagIcon" />;
    case 'chat':
      return <ChatIcon {...rest} data-testid="Icon-Component-ChatIcon" />;
    case 'membershipRequests':
      return (
        <RequestsIcon
          width={20}
          height={20}
          fill={fill || 'currentColor'}
          data-testid="Icon-Component-RequestsIcon"
        />
      );
    case 'events':
      return <EventsIcon {...rest} data-testid="Icon-Component-EventsIcon" />;

    case 'posts':
      return <PostsIcon {...rest} data-testid="Icon-Component-PostsIcon" />;
    case 'blockUnblock':
      return (
        <BlockUserIcon
          {...rest}
          data-testid="Block/Icon-Component-UnblockIcon"
        />
      );
    case 'settings':
      return (
        <SettingsIcon stroke={fill} data-testid="Icon-Component-SettingsIcon" />
      );
    case 'listEventRegistrants':
      return (
        <ListEventRegistrantsIcon
          data-testid="Icon-Component-List-Event-Registrants"
          stroke={fill}
        />
      );
    case 'checkInRegistrants':
      return (
        <CheckInRegistrantsIcon
          data-testid="Icon-Component-Check-In-Registrants"
          stroke={fill}
        />
      );
    case 'advertisement':
      return (
        <PostsIcon data-testid="Icon-Component-Advertisement" stroke={fill} />
      );
    case 'funds':
      return <FundsIcon data-testid="Icon-Component-Funds" stroke={fill} />;
    case 'donate':
      return <FundsIcon data-testid="Icon-Component-Donate" stroke={fill} />;
    case 'transactions':
      return (
        <FundsIcon data-testid="Icon-Component-Transactions" stroke={fill} />
      );
    case 'venues':
      return <VenueIcon data-testid="Icon-Component-Venues" stroke={fill} />;
    case 'campaigns':
      return (
        <NewspaperOutlined
          className={styles.iconColor}
          style={
            {
              '--icon-color': fill || 'currentColor',
            } as React.CSSProperties
          }
          data-testid="Icon-Component-Campaigns"
        />
      );
    case 'myPledges':
      return (
        <ContactPageOutlined
          className={styles.iconColor}
          style={
            {
              '--icon-color': fill || 'currentColor',
            } as React.CSSProperties
          }
          data-testid="Icon-Component-My-Pledges"
        />
      );
    case 'leaveOrganization':
      return (
        <ExitToAppIcon
          className={styles.iconColor}
          style={
            {
              '--icon-color': fill || 'currentColor',
            } as React.CSSProperties
          }
          data-testid="Icon-Component-Leave-Organization"
        />
      );
    case 'volunteer':
    case 'volunteers':
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
          {...rest}
          className={styles.iconColor}
          data-testid="Icon-Component-DefaultIcon"
        />
      );
  }
};

export default IconComponent;
