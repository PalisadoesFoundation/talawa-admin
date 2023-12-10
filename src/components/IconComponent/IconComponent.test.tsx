import React from 'react';
import { render, screen } from '@testing-library/react';
import IconComponent from './IconComponent';

const screenTestIdMap: Record<string, Record<string, string>> = {
  AllOrganizations: {
    name: 'My Organizations',
    testId: 'Icon-Component-AllOrganizationsIcon',
  },
  Dashboard: {
    name: 'Dashboard',
    testId: 'Icon-Component-DashboardIcon',
  },
  People: {
    name: 'People',
    testId: 'Icon-Component-PeopleIcon',
  },
  Events: {
    name: 'Events',
    testId: 'Icon-Component-EventsIcon',
  },
  Posts: {
    name: 'Posts',
    testId: 'Icon-Component-PostsIcon',
  },
  BlockUnblock: {
    name: 'Block/Unblock',
    testId: 'Block/Icon-Component-UnblockIcon',
  },
  Plugins: {
    name: 'Plugins',
    testId: 'Icon-Component-PluginsIcon',
  },
  Settings: {
    name: 'Settings',
    testId: 'Icon-Component-SettingsIcon',
  },
  EventProject: {
    name: 'Add Event Project',
    testId: 'Icon-Component-Add-Event-Project',
  },
  ListEventRegistrant: {
    name: 'List Event Registrants',
    testId: 'Icon-Component-List-Event-Registrants',
  },
  CheckInRegistrants: {
    name: 'Check In Registrants',
    testId: 'Icon-Component-Check-In-Registrants',
  },
  EventStats: {
    name: 'Event Stats',
    testId: 'Icon-Component-Event-Stats',
  },
  default: {
    name: 'default',
    testId: 'Icon-Component-DefaultIcon',
  },
};

describe('Testing Collapsible Dropdown component', () => {
  it('Renders the correct icon according to the component', () => {
    for (const component in screenTestIdMap) {
      render(<IconComponent name={screenTestIdMap[component].name} />);
      expect(
        screen.getByTestId(screenTestIdMap[component].testId)
      ).toBeInTheDocument();
    }
  });
});
