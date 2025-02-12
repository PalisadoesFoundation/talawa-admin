export interface InterfaceAddOnRegisterProps {
  id?: string; // Optional organization ID
  createdBy?: string; // Optional user who created the advertisement
  formStatus?: string; // Determines if the form is in register or edit mode
  idEdit?: string; // ID of the advertisement to edit
  nameEdit?: string; // Name of the advertisement to edit
  typeEdit?: string; // Type of the advertisement to edit
  orgIdEdit?: string; // Organization ID associated with the advertisement
  advertisementMediaEdit?: string; // Media URL of the advertisement to edit
  endDateEdit?: Date; // End date of the advertisement to edit
  startDateEdit?: Date; // Start date of the advertisement to edit
  setAfter: React.Dispatch<React.SetStateAction<string | null | undefined>>; // Function to update parent state
}
export interface InterfaceFormStateTypes {
  name: string; // Name of the advertisement
  advertisementMedia: string; // Base64-encoded media of the advertisement
  type: string; // Type of advertisement (e.g., BANNER, POPUP)
  startDate: Date; // Start date of the advertisement
  endDate: Date; // End date of the advertisement
  organizationId: string | undefined; // Organization ID
}

export interface InterfaceAddOnEntryProps {
  id: string;
  name?: string;
  mediaUrl?: string;
  type?: string;
  organizationId?: string;
  startDate?: Date;
  endDate?: Date;
  setAfter: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}
