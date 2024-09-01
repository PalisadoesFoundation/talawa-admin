import React from 'react';
import { render, screen } from '@testing-library/react';
import IconComponent from './IconComponent';

const screenTestIdMap: Record<string, Record<string, string>> = {
  MyOrganizations: {
    name: 'My Organizations',
    testId: 'Icon-Component-MyOrganizationsIcon',
  },
  Dashboard: {
    name: 'Dashboard',
    testId: 'Icon-Component-DashboardIcon',
  },
  People: {
    name: 'People',
    testId: 'Icon-Component-PeopleIcon',
  },
  Tags: {
    name: 'Tags',
    testId: 'Icon-Component-TagsIcon',
  },
  Tag: {
    name: 'Tag',
    testId: 'Icon-Component-TagIcon',
  },
  Requests: {
    name: 'Requests',
    testId: 'Icon-Component-RequestsIcon',
  },
  Events: {
    name: 'Events',
    testId: 'Icon-Component-EventsIcon',
  },
  ActionItems: {
    name: 'Action Items',
    testId: 'Icon-Component-ActionItemIcon',
  },
  AgendaItemsCategory: {
    name: 'Agenda Items Category',
    testId: 'Icon-Component-AgendaCategoryIcon',
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
  ListEventRegistrants: {
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
  Advertisement: {
    name: 'Advertisement',
    testId: 'Icon-Component-Advertisement',
  },
  Funds: {
    name: 'Funds',
    testId: 'Icon-Component-Funds',
  },
  Venues: {
    name: 'Venues',
    testId: 'Icon-Component-Venues',
  },
  Donate: {
    name: 'Donate',
    testId: 'Icon-Component-Donate',
  },
  Campaigns: {
    name: 'Campaigns',
    testId: 'Icon-Component-Campaigns',
  },
  MyPledges: {
    name: 'My Pledges',
    testId: 'Icon-Component-My-Pledges',
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
        screen.getByTestId(screenTestIdMap[component].testId),
      ).toBeInTheDocument();
    }
  });
});
