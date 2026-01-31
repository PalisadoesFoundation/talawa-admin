import type React from 'react';
/**
 * Props for PageHeader component.
 */
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
  }>;
  showEventTypeFilter?: boolean;
  selectedEventType?: string;
  onEventTypeChange?: (value: string) => void;
  actions?: React.ReactNode;
}
