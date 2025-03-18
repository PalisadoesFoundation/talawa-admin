import React from 'react';
import { render, screen } from '@testing-library/react';
import IconComponent from './IconComponent';
import { describe, it, expect } from 'vitest';

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
  Overview: {
    name: 'Overview',
    testId: 'Icon-Component-OverviewIcon',
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
  Posts: {
    name: 'Posts',
    testId: 'Icon-Component-PostsIcon',
  },
  BlockUnblock: {
    name: 'Block/Unblock',
    testId: 'Block/Icon-Component-UnblockIcon',
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
  LeaveOrganization: {
    name: 'Leave Organization',
    testId: 'Icon-Component-Leave-Organization',
  },
  Volunteer: {
    name: 'Volunteer',
    testId: 'Icon-Component-Volunteer',
  },
  Reload: {
    name: 'Reload',
    testId: 'Icon-Component-ReloadIcon',
  },
  Save: {
    name: 'Save',
    testId: 'Icon-Component-SaveIcon',
  },
  Delete: {
    name: 'Delete',
    testId: 'Icon-Component-DeleteIcon',
  },
  Global: {
    name: 'Global',
    testId: 'Icon-Component-GlobalIcon',
  },
  MemberOrganization: {
    name: 'Member Organization',
    testId: 'Icon-Component-MemberOrganizationIcon',
  },
  MemberEvents: {
    name: 'Member Events',
    testId: 'Icon-Component-MemberEventsIcon',
  },
  default: {
    name: 'default',
    testId: 'Icon-Component-DefaultIcon',
  },
};

describe('Testing IconComponent rendering', () => {
  it('Renders the correct icon according to the component', () => {
    for (const component in screenTestIdMap) {
      render(<IconComponent name={screenTestIdMap[component].name} />);
      expect(
        screen.getByTestId(screenTestIdMap[component].testId),
      ).toBeInTheDocument();
    }
  });
});
