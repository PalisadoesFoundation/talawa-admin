import type { Organization } from 'types/Organization/type';

export type Venue = {
  id: string; // Changed from _id to id for PostgreSQL compatibility
  capacity?: number;
  description?: string;
  imageUrl?: string;
  name: string;
  organization: Organization;
  attachments?: Array<{
    url: string;
    mimeType: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

export type VenueInput = {
  capacity?: number;
  description?: string;
  file?: string;
  name: string;
  organizationId: string;
};

export type EditVenueInput = {
  capacity?: number;
  description?: string; // Optional
  file?: string; // Optional
  id: string;
  name?: string; // Optional
};
