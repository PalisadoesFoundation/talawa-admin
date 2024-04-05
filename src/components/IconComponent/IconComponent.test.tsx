<<<<<<< HEAD
import { render, screen } from '@testing-library/react';
import IconComponent from './IconComponent';
import React from 'react';
=======
import React from 'react';
import { render, screen } from '@testing-library/react';
import IconComponent from './IconComponent';

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
const screenTestIdMap: Record<string, Record<string, string>> = {
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
<<<<<<< HEAD
  ActionItems: {
    name: 'Action Items',
    testId: 'Icon-Component-ActionItemIcon',
  },
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  Posts: {
    name: 'Posts',
    testId: 'Icon-Component-PostsIcon',
  },
<<<<<<< HEAD
  Funds: {
    name: 'Funds',
    testId: 'Icon-Component-Funds',
  },
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
  AllOrganizations: {
<<<<<<< HEAD
    name: 'My Organizations',
    testId: 'Icon-Component-MyOrganizationsIcon',
=======
    name: 'All Organizations',
    testId: 'Icon-Component-AllOrganizationsIcon',
  },
  EventProject: {
    name: 'Add Event Project',
    testId: 'Icon-Component-Add-Event-Project',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
  Advertisement: {
    name: 'Advertisement',
    testId: 'Icon-Component-Advertisement',
  },
  Venues: {
    name: 'Venues',
    testId: 'Icon-Component-Venues',
  },
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
        screen.getByTestId(screenTestIdMap[component].testId),
=======
        screen.getByTestId(screenTestIdMap[component].testId)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      ).toBeInTheDocument();
    }
  });
});
