export interface InterfaceJoinedOrgEdge {
  node: {
    id: string;
    name: string;
    adminsCount: number;
    membersCount: number;
    description?: string;
    avatarURL?: string;
  };
}

export interface InterfaceJoinedOrganizationsData {
  user: {
    organizationsWhereMember?: {
      edges?: InterfaceJoinedOrgEdge[];
    };
  };
}
