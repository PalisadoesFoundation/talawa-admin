import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
export interface InterfaceVenueModalProps {
  show: boolean;
  onHide: () => void;
  refetchVenues: () => void;
  orgId: string;
  venueData?: InterfaceQueryVenueListItem | null;
  edit: boolean;
}
