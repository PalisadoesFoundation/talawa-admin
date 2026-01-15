/**
 * Props for InviteByEmailModal component.
 */
export interface InterfaceInviteByEmailModalProps {
  show: boolean;
  handleClose: () => void;
  eventId: string;
  isRecurring?: boolean;
  onInvitesSent?: () => void;
}
