/**
 * Props for the PledgeModal component.
 */
import type { InterfacePledgeInfo } from 'utils/interfaces';
export interface InterfacePledgeModal {
  isOpen: boolean;
  hide: () => void;
  campaignId: string;
  userId: string;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
  mode: 'create' | 'edit';
}
