import React from 'react';
import { QuestionMarkOutlined } from '@mui/icons-material';
import { ReactComponent as BlockUserIcon } from 'assets/svgs/blockUser.svg';
import { ReactComponent as DashboardIcon } from 'assets/svgs/dashboard.svg';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as PeopleIcon } from 'assets/svgs/people.svg';
import { ReactComponent as PluginsIcon } from 'assets/svgs/plugins.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/posts.svg';
import { ReactComponent as SettingsIcon } from 'assets/svgs/settings.svg';

export interface InterfaceIconComponent {
  name: string;
  fill?: string;
  height?: string;
  width?: string;
}

const iconComponent = (props: InterfaceIconComponent): JSX.Element => {
  switch (props.name) {
    case 'Dashboard':
      return (
        <DashboardIcon {...props} data-testid="Icon-Component-DashboardIcon" />
      );
    case 'People':
      return <PeopleIcon {...props} data-testid="Icon-Component-PeopleIcon" />;
    case 'Events':
      return <EventsIcon {...props} data-testid="Icon-Component-EventsIcon" />;
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
    case 'All Organizations':
      return (
        <OrganizationsIcon
          stroke={props.fill}
          data-testid="Icon-Component-AllOrganizationsIcon"
        />
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
