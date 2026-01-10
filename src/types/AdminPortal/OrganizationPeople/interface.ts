/**
 * GraphQL user/member node rendered in the AdminPortal OrganizationPeople table.
 */

export type OrganizationMemberRole = 'ADMIN' | 'MEMBER';

export interface IUserNode {
  id: string;
  name: string;
  role: OrganizationMemberRole;
  avatarURL?: string | null;
  emailAddress?: string | null;
  createdAt?: string | null;
}
