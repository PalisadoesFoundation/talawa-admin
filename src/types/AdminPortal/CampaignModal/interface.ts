import type { InterfaceCampaignInfo } from 'utils/interfaces';

/**
 * Props for the CampaignModal component.
 */
export interface InterfaceCampaignModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;

  /** Callback to close/hide the modal */
  hide: () => void;

  /** ID of the fund this campaign belongs to */
  fundId: string;

  /** ID of the organization */
  orgId: string;

  /** Campaign data for edit mode, null when creating a new campaign */
  campaign: InterfaceCampaignInfo | null;

  /** Callback to refetch campaign data after create/update */
  refetchCampaign: () => void;

  /** Modal mode: 'create' for new campaign, 'edit' for existing campaign */
  mode: 'create' | 'edit';
}
