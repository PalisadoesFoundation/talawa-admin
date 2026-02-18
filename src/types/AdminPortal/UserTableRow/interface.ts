import type React from 'react';

/**
 * User information interface for UserTableRow component
 */
export interface InterfaceUserInfo {
  id: string;
  name: string;
  emailAddress?: string | null;
  avatarURL?: string | null;
  createdAt?: string | null;
}

/**
 * Action button variant types for styling
 */
export type InterfaceActionVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'default';

/**
 * Action button configuration interface
 */
export interface InterfaceActionButton {
  label: string;
  onClick: (user: InterfaceUserInfo) => void;
  icon?: React.ReactElement;
  variant?: InterfaceActionVariant;
  testId?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Props interface for UserTableRow component
 */
export interface InterfaceUserTableRowProps {
  user: InterfaceUserInfo;
  rowNumber?: number;
  linkPath?: string;
  actions?: InterfaceActionButton[];
  showJoinedDate?: boolean;
  onRowClick?: (user: InterfaceUserInfo) => void;
  isDataGrid?: boolean;
  compact?: boolean;
  testIdPrefix?: string;
}
