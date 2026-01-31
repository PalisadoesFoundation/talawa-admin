/**
 * Props for EventRegistrantsModal component.
 */

export interface InterfaceEventRegistrantsModalProps {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
}

export interface InterfaceBaseModalProps {
  show: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  dataTestId?: string;
  onHide?: () => void;
}

export interface InterfaceAutocompleteMockProps {
  renderInput: (params: Record<string, unknown>) => JSX.Element;
  options?: { id: string; name?: string }[];
  onChange?: (
    event: React.SyntheticEvent,
    value: { id: string; name?: string } | null,
  ) => void;
  noOptionsText?: string;
}
