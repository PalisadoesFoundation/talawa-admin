import type { ReactNode } from 'react';

/**
 * Interface for PageHeader component props.
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
    containerClassName?: string;
    toggleClassName?: string;
    icon?: string;
  }>;
  showEventTypeFilter?: boolean;
  actions?: ReactNode;
  rootClassName?: string;
}
