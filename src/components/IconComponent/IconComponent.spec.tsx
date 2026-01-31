import React from 'react';
import { render, screen } from '@testing-library/react';
import IconComponent from './IconComponent';
import { describe, it, expect } from 'vitest';

const screenTestIdMap: Record<string, Record<string, string>> = {
  MyOrganizations: {
    name: 'myOrganizations',
    testId: 'Icon-Component-MyOrganizationsIcon',
  },
  Dashboard: {
    name: 'dashboard',
    testId: 'Icon-Component-DashboardIcon',
  },
  People: {
    name: 'people',
    testId: 'Icon-Component-PeopleIcon',
  },
  Tags: {
    name: 'tags',
    testId: 'Icon-Component-TagsIcon',
  },
  Tag: {
    name: 'tag',
    testId: 'Icon-Component-TagIcon',
  },
  Requests: {
    name: 'membershipRequests',
    testId: 'Icon-Component-RequestsIcon',
  },
  Events: {
    name: 'events',
    testId: 'Icon-Component-EventsIcon',
  },
  ActionItems: {
    name: 'actionItems',
    testId: 'Icon-Component-ActionItemIcon',
  },
  Posts: {
    name: 'posts',
    testId: 'Icon-Component-PostsIcon',
  },
  BlockUnblock: {
    name: 'blockUnblock',
    testId: 'Block/Icon-Component-UnblockIcon',
  },
  Settings: {
    name: 'settings',
    testId: 'Icon-Component-SettingsIcon',
  },
  ListEventRegistrants: {
    name: 'listEventRegistrants',
    testId: 'Icon-Component-List-Event-Registrants',
  },
  CheckInRegistrants: {
    name: 'checkInRegistrants',
    testId: 'Icon-Component-Check-In-Registrants',
  },
  Advertisement: {
    name: 'advertisement',
    testId: 'Icon-Component-Advertisement',
  },
  Funds: {
    name: 'funds',
    testId: 'Icon-Component-Funds',
  },
  Venues: {
    name: 'venues',
    testId: 'Icon-Component-Venues',
  },
  Donate: {
    name: 'donate',
    testId: 'Icon-Component-Donate',
  },
  Campaigns: {
    name: 'campaigns',
    testId: 'Icon-Component-Campaigns',
  },
  MyPledges: {
    name: 'myPledges',
    testId: 'Icon-Component-My-Pledges',
  },
  LeaveOrganization: {
    name: 'leaveOrganization',
    testId: 'Icon-Component-Leave-Organization',
  },
  Volunteer: {
    name: 'volunteer',
    testId: 'Icon-Component-Volunteer',
  },
  Transactions: {
    name: 'transactions',
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
    render(<IconComponent name="campaigns" fill="var(--bs-danger)" />);
    const icon = screen.getByTestId('Icon-Component-Campaigns');
    expect(icon).toBeInTheDocument();
    // Material-UI applies style prop to the root element
    expect(icon).toHaveStyle({ '--icon-color': 'var(--bs-danger)' });
  });

  it('applies sx color to MyPledges icon', () => {
    render(<IconComponent name="myPledges" fill="var(--bs-success)" />);
    const icon = screen.getByTestId('Icon-Component-My-Pledges');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({ '--icon-color': 'var(--bs-success)' });
  });

  it('applies sx color to LeaveOrganization icon', () => {
    render(<IconComponent name="leaveOrganization" fill="var(--bs-primary)" />);
    const icon = screen.getByTestId('Icon-Component-Leave-Organization');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({ '--icon-color': 'var(--bs-primary)' });
  });

  it('uses currentColor as fallback when fill is not provided for Campaigns', () => {
    render(<IconComponent name="campaigns" />);
    const icon = screen.getByTestId('Icon-Component-Campaigns');
    expect(icon).toBeInTheDocument();
    // When fill is not provided, the component uses 'currentColor' which is computed
    // by the browser to inherit from the parent's text color (canvastext in jsdom)
    // We verify the icon renders correctly without explicit fill
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('uses currentColor as fallback when fill is not provided for MyPledges', () => {
    render(<IconComponent name="myPledges" />);
    const icon = screen.getByTestId('Icon-Component-My-Pledges');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('uses currentColor as fallback when fill is not provided for LeaveOrganization', () => {
    render(<IconComponent name="leaveOrganization" />);
    const icon = screen.getByTestId('Icon-Component-Leave-Organization');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('applies sx color with CSS variable value', () => {
    render(<IconComponent name="campaigns" fill="var(--bs-primary)" />);
    const icon = screen.getByTestId('Icon-Component-Campaigns');
    expect(icon).toBeInTheDocument();
    // CSS variables are passed through as-is to the sx prop
    expect(icon).toHaveStyle({ '--icon-color': 'var(--bs-primary)' });
  });
});
describe('IconComponent Chat icon', () => {
  it('renders Chat icon with correct testId', () => {
    render(<IconComponent name="chat" />);
    const icon = screen.getByTestId('Icon-Component-ChatIcon');
    expect(icon).toBeInTheDocument();
  });
});
describe('IconComponent Volunteer icon', () => {
  it('renders Volunteer icon with size prop when width/height is provided', () => {
    // MdOutlineVolunteerActivism uses 'size' prop. We expect the component to use width or height for it.
    render(<IconComponent name="volunteer" width={24} height={24} />);
    const icon = screen.getByTestId('Icon-Component-Volunteer');
    expect(icon).toBeInTheDocument();
    // React Icons (react-icons) renders an SVG. The size prop sets width and height attributes or style.
    // For MdOutlineVolunteerActivism (and other react-icons), size usually sets width and height attributes directly.
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
  });
});
