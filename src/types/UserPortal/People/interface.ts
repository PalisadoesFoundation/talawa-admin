/**
 * GraphQL member node used by the UserPortal People screen.
 */
export interface IMemberNode {
  id: string;
  name: string;
  role: string;
  avatarURL?: string;
  createdAt: string;
  emailAddress?: string;
}
