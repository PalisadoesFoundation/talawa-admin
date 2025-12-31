import React from 'react';

export interface InterfaceUserInfo {
  id: string;
  name: string;
  emailAddress?: string | null;
  avatarURL?: string | null;
  createdAt?: string | null;
}

export type InterfaceActionVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'default';

export interface InterfaceActionButton {
  label: string;
  onClick: (user: InterfaceUserInfo) => void;
  icon?: React.ReactElement;
  variant?: InterfaceActionVariant;
  testId?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

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
