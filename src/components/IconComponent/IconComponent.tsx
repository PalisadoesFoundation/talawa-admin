import React from 'react';
import { QuestionMarkOutlined } from '@mui/icons-material';
import { ReactComponent as BlockUserIcon } from '../../assets/svgs/icons/blockUser.svg';
import { ReactComponent as DashboardIcon } from '../../assets/svgs/icons/dashboard.svg';
import { ReactComponent as EventsIcon } from '../../assets/svgs/icons/events.svg';
import { ReactComponent as OrganizationsIcon } from '../../assets/svgs/icons/organizations.svg';
import { ReactComponent as PeopleIcon } from '../../assets/svgs/icons/people.svg';
import { ReactComponent as PluginsIcon } from '../../assets/svgs/icons/plugins.svg';
import { ReactComponent as PostsIcon } from '../../assets/svgs/icons/posts.svg';
import { ReactComponent as SettingsIcon } from '../../assets/svgs/icons/settings.svg';

const iconComponent = (props: {
  name: string;
  fill?: string;
  height?: string;
  width?: string;
}): JSX.Element => {
  switch (props.name) {
    case 'Dashboard':
      return <DashboardIcon {...props} />;
    case 'People':
      return <PeopleIcon {...props} />;
    case 'Events':
      return <EventsIcon {...props} />;
    case 'Posts':
      return <PostsIcon {...props} />;
    case 'Block/Unblock':
      return <BlockUserIcon {...props} />;
    case 'Plugins':
      return <PluginsIcon stroke={props.fill} />;
    case 'Settings':
      return <SettingsIcon stroke={props.fill} />;
    case 'All Organizations':
      return <OrganizationsIcon stroke={props.fill} />;
    default:
      return <QuestionMarkOutlined {...props} />;
  }
};

export default iconComponent;
