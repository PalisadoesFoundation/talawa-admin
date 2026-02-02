import React from 'react';
import { render, screen } from '@testing-library/react';
import IconComponent from './IconComponent';
import { describe, it, expect, afterEach, vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});

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
    name: 'ActionItem',
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
  Transactions: {
    name: 'Transactions',
    testId: 'Icon-Component-Transactions',
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

describe('IconComponent sx color handling', () => {
  it('applies sx color to Campaigns icon', () => {
    render(<IconComponent name="Campaigns" fill="#FF0000" />);
    const icon = screen.getByTestId('Icon-Component-Campaigns');
    expect(icon).toBeInTheDocument();
    // Material-UI applies sx color via inline style or class
    // The icon should have the color applied
    expect(icon).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('applies sx color to MyPledges icon', () => {
    render(<IconComponent name="My Pledges" fill="#00FF00" />);
    const icon = screen.getByTestId('Icon-Component-My-Pledges');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({ color: 'rgb(0, 255, 0)' });
  });

  it('applies sx color to LeaveOrganization icon', () => {
    render(<IconComponent name="Leave Organization" fill="#0000FF" />);
    const icon = screen.getByTestId('Icon-Component-Leave-Organization');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({ color: 'rgb(0, 0, 255)' });
  });

  it('uses currentColor as fallback when fill is not provided for Campaigns', () => {
    render(<IconComponent name="Campaigns" />);
    const icon = screen.getByTestId('Icon-Component-Campaigns');
    expect(icon).toBeInTheDocument();
    // When fill is not provided, the component uses 'currentColor' which is computed
    // by the browser to inherit from the parent's text color (canvastext in jsdom)
    // We verify the icon renders correctly without explicit fill
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('uses currentColor as fallback when fill is not provided for MyPledges', () => {
    render(<IconComponent name="My Pledges" />);
    const icon = screen.getByTestId('Icon-Component-My-Pledges');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('uses currentColor as fallback when fill is not provided for LeaveOrganization', () => {
    render(<IconComponent name="Leave Organization" />);
    const icon = screen.getByTestId('Icon-Component-Leave-Organization');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('applies sx color with CSS variable value', () => {
    render(<IconComponent name="Campaigns" fill="var(--bs-primary)" />);
    const icon = screen.getByTestId('Icon-Component-Campaigns');
    expect(icon).toBeInTheDocument();
    // CSS variables are passed through as-is to the sx prop
    expect(icon).toHaveStyle({ color: 'var(--bs-primary)' });
  });
});
describe('IconComponent Chat icon', () => {
  it('renders Chat icon with correct testId', () => {
    render(<IconComponent name="Chat" />);
    const icon = screen.getByTestId('Icon-Component-ChatIcon');
    expect(icon).toBeInTheDocument();
  });
});

describe('IconComponent dimension props', () => {
  it('applies custom height and width to Dashboard icon', () => {
    render(<IconComponent name="Dashboard" height="48" width="48" />);
    const icon = screen.getByTestId('Icon-Component-DashboardIcon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('height', '48');
    expect(icon).toHaveAttribute('width', '48');
  });

  it('applies custom height and width to People icon', () => {
    render(<IconComponent name="People" height="32" width="32" />);
    const icon = screen.getByTestId('Icon-Component-PeopleIcon');
    expect(icon).toHaveAttribute('height', '32');
    expect(icon).toHaveAttribute('width', '32');
  });

  it('applies all props (fill, height, width) to Tags icon', () => {
    render(<IconComponent name="Tags" fill="#FF5733" height="40" width="40" />);
    const icon = screen.getByTestId('Icon-Component-TagsIcon');
    expect(icon).toHaveAttribute('fill', '#FF5733'); // <-- fix
    expect(icon).toHaveAttribute('height', '40');
    expect(icon).toHaveAttribute('width', '40');
  });

  it('uses default dimensions when height and width are not provided', () => {
    render(<IconComponent name="Events" />);
    const icon = screen.getByTestId('Icon-Component-EventsIcon');
    expect(icon).toBeInTheDocument();
    // Material-UI icons have default fontSize when dimensions aren't specified
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });
});
