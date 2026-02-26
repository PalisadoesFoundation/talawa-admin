export interface IEdge {
  cursor: string;
  node: {
    id: string;
    name: string;
    role: string;
    avatarURL: string;
    emailAddress: string;
    createdAt?: string;
  };
}

export interface IUserDetails {
  id: string;
  name: string;
  emailAddress: string;
  avatarURL?: string;
}

export interface IQueryVariable {
  orgId?: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  where?: { role: { equal: 'administrator' | 'regular' } };
}

// Re-export from shared AdminPortal types module
export { OrganizationMembershipRole } from 'types/AdminPortal/OrganizationMembershipRole/interface';
