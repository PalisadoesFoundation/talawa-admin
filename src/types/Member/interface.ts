export interface InterfaceRequestsListItem {
  membershipRequestId: string; // Changed from id
  createdAt: string;
  status: string;
  user: {
    avatarURL?: string;
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

export interface InterfaceMembersList {
  organizations: {
    id: string;
    members: InterfaceMemberInfo[];
  }[];
}
