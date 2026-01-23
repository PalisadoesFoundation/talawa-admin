import type { ReactNode } from 'react';

/**
 * Props for PeopleTabNavbar component.
 */
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
  showEventTypeFilter?: boolean;
  actions?: ReactNode;
}
