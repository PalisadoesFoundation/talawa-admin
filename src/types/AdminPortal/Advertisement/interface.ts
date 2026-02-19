import type { AdvertisementAttachment, FileMetadataAttachment } from './type';

export interface InterfaceAddOnRegisterProps {
  formStatus?: string; // Determines if the form is in register or edit mode
  idEdit?: string; // ID of the advertisement to edit
  nameEdit?: string; // Name of the advertisement to edit
  typeEdit?: string; // Type of the advertisement to edit
  descriptionEdit?: string | null; // Description of the advertisement to edit
  id?: string; // Optional organization ID
  createdBy?: string; // Optional user who created the advertisement
  endAtEdit?: Date; // End date of the advertisement to edit
  startAtEdit?: Date; // Start date of the advertisement to edit
  setAfterActive: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >; // Function to update parent state
  setAfterCompleted: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >; // Function to update parent state
}

export interface InterfaceFormStateTypes {
  name: string; // Name of the advertisement
  type: string; // Type of advertisement (e.g., BANNER, POPUP)
  startAt: Date; // Start date of the advertisement
  description: string | null; // Description of the advertisement
  endAt: Date; // End date of the advertisement
  organizationId?: string | undefined; // Organization ID
  attachments: FileMetadataAttachment[]; // Attachment metadata array from MinIO uploads
  existingAttachments?: string | undefined; // Existing media URLs for preview display
}

export interface InterfaceAddOnEntryProps {
  id: string;
  name?: string;
  existingAttachments?: string;
  type?: string;
  organizationId?: string;
  startAt?: Date;
  endAt?: Date;
  attachments?: AdvertisementAttachment[];
  setAfter: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}
