export interface InterfaceMemberRequestCardProps {
  id: string; // Unique identifier for the member
  memberName: string; // Name of the member
  memberLocation: string; // Location of the member
  joinDate: string; // Date when the member joined
  memberImage: string; // URL for the member's image
  email: string; // Email of the member
}

export interface InterfaceRequestsListItem {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
