export interface InterfaceMemberRequestCardProps {
  id: string; // Unique identifier for the member
  memberName: string; // Name of the member
  memberLocation: string; // Location of the member
  joinDate: string; // Date when the member joined
  memberImage: string; // URL for the member's image
  email: string; // Email of the member
}

export interface InterfaceRequestsListItem {
  membershipRequestId: string; // Changed from id
  createdAt: string;
  status: string;
  user: {
    emailAddress: string; // Changed from email
    id: string;
    name: string; // Changed from firstName/lastName
  };
}

export interface InterfaceMemberInfo {
  id: string;
  name: string;
  emailAddress: string;
  avatarURL: string;
  createdAt: string;
}

interface InterfaceMembersList {
  organizations: {
    id: string;
    members: InterfaceMemberInfo[];
  }[];
}
