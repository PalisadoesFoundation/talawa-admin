import type { Organization } from 'types/AdminPortal/Organization/type';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';

export type Venue = {
  _id: string;
  capacity: number;
  description?: string;
  imageUrl?: string;
  name: string;
  organization: Organization;
};

export type VenueInput = {
  capacity: number;
  description?: string;
  file?: string;
  name: string;
  organizationId: string;
};

export type EditVenueInput = {
  capacity?: number; // Optional
  description?: string; // Optional
  file?: string; // Optional
  id: string;
  name?: string; // Optional
};

export interface InterfaceVenueCardProps {
  venueItem: InterfaceQueryVenueListItem;
  showEditVenueModal: (venueItem: InterfaceQueryVenueListItem) => void;
  handleDelete: (venueId: string) => void;
}
