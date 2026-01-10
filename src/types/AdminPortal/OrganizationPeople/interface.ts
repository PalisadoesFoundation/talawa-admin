/**
 * GraphQL user/member node rendered in the AdminPortal OrganizationPeople table.
 */

export interface IUserNode {
  id: string;
  name: string;
  role: string;
  avatarURL?: string;
  emailAddress?: string;
  createdAt?: string;
}
