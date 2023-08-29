import React from 'react';
import { render, screen } from '@testing-library/react';
import IconComponent from './IconComponent';

const screenTestIdMap = {
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
  AllOrganizations: {
    name: 'All Organizations',
    testId: 'Icon-Component-AllOrganizationsIcon',
  },
  default: {
    name: 'default',
    testId: 'Icon-Component-DefaultIcon',
  },
};

describe('Testing CollapsibleDropdown component', () => {
  it('renders the Dashboard icon', () => {
    render(<IconComponent name="Dashboard" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.Dashboard.testId}`)
    ).toBeInTheDocument();
  });
  it('renders the People icon', () => {
    render(<IconComponent name="People" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.People.testId}`)
    ).toBeInTheDocument();
  });
  it('renders the Events icon', () => {
    render(<IconComponent name="Events" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.Events.testId}`)
    ).toBeInTheDocument();
  });
  it('renders the Posts icon', () => {
    render(<IconComponent name="Posts" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.Posts.testId}`)
    ).toBeInTheDocument();
  });
  it('renders the Block/Unblock icon', () => {
    render(<IconComponent name="Block/Unblock" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.BlockUnblock.testId}`)
    ).toBeInTheDocument();
  });
  it('renders the Plugins icon', () => {
    render(<IconComponent name="Plugins" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.Plugins.testId}`)
    ).toBeInTheDocument();
  });
  it('renders the Settings icon', () => {
    render(<IconComponent name="Settings" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.Settings.testId}`)
    ).toBeInTheDocument();
  });
  it('renders the All Organizations icon', () => {
    render(<IconComponent name="All Organizations" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.AllOrganizations.testId}`)
    ).toBeInTheDocument();
  });
  it('renders the default icon', () => {
    render(<IconComponent name="default" />);
    expect(
      screen.getByTestId(`${screenTestIdMap.default.testId}`)
    ).toBeInTheDocument();
  });
});
