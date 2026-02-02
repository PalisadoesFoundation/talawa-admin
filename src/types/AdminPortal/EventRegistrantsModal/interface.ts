/**
 * Props for EventRegistrantsModal component.
 */
import type React from 'react';
export interface InterfaceEventRegistrantsModalProps {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
}

/**
 * Props for BaseModal mock component used in tests.
 */
export interface InterfaceBaseModalProps {
  show: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  dataTestId?: string;
  onHide?: () => void;
}

/**
 * Props for Autocomplete mock component used in tests.
 */
export interface InterfaceAutocompleteMockProps {
  renderInput: (params: Record<string, unknown>) => JSX.Element;
  options?: { id: string; name?: string }[];
  onChange?: (
    event: React.SyntheticEvent,
    value: { id: string; name?: string } | null,
  ) => void;
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: string,
  ) => void;
  inputValue?: string;
  noOptionsText?: string;
}
