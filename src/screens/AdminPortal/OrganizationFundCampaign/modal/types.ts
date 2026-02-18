import type { InterfaceCampaignInfo } from 'utils/interfaces';

/**
 * Props interface for the CampaignModal component.
 *
 * - isOpen: Controls visibility of the modal
 * - hide: Callback function to close the modal
 * - fundId: ID of the fund this campaign belongs to
 * - orgId: ID of the organization
 * - campaign: Existing campaign data for editing, or null for create mode
 * - refetchCampaign: Callback to refresh the campaign list after changes
 * - mode: Determines if the modal is in 'create' or 'edit' mode
 */
export interface InterfaceCampaignModal {
  isOpen: boolean;
  hide: () => void;
  fundId: string;
  orgId: string;
  campaign: InterfaceCampaignInfo | null;
  refetchCampaign: () => void;
  mode: 'create' | 'edit';
}

export interface IDateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}
