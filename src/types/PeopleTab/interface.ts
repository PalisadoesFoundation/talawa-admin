import React from 'react';

/** Shared node shape for member/user rows in People screens. */
export interface InterfaceMemberNode {
  id: string;
  name: string;
  role: string;
  avatarURL?: string;
  createdAt?: string;
  emailAddress?: string;
}

// Props for PageHeader component
export interface InterfacePageHeaderProps {
  title?: string;
  search?: {
    placeholder: string;
    onSearch: (value: string) => void;
    inputTestId?: string;
    buttonTestId?: string;
  };
  sorting?: Array<{
    title: string;
    options: { label: string; value: string | number }[];
    selected: string | number;
    onChange: (value: string | number) => void;
    testIdPrefix: string;
    icon?: React.ReactNode;
  }>;

  actions?: React.ReactNode;
}

export interface InterfacePeopleTabNavbarProps {
  title?: string;
  search?: {
    placeholder: string;
    onSearch: (value: string) => void;
    inputTestId?: string;
    buttonTestId?: string;
  };
  sorting?: Array<{
    title: string;
    options: { label: string; value: string | number }[];
    selected: string | number;
    onChange: (value: string | number) => void;
    testIdPrefix: string;
    icon?: string | null;
  }>;

  actions?: React.ReactNode;
}

// Props for individual tab in a tab list
export interface InterfacePeopleTab {
  title: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  action: () => void;
  testId?: string;
}

export interface InterfacePeopleTabNavbar {
  title: string;
  icon?: string;
  isActive?: boolean;
  action: () => void;
  testId?: string;
}

// Props for displaying user events in PeopleTabUserEvents component
export interface InterfacePeopletabUserEventsProps {
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  eventName?: string;
  eventDescription?: string;
  actionIcon?: React.ReactNode;
  actionName?: string;
}

// Props for displaying organization info in PeopleTabUserOrganization component
export interface InterfacePeopleTabUserOrganizationProps {
  img?: string;
  title: string;
  description?: string;
  adminCount?: number;
  membersCount?: number;
  actionIcon?: React.ReactNode;
  actionName?: string;
}
