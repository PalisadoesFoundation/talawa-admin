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

/**
 * Props for the PeopleCard component.
 */
export interface InterfacePeopleCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
  role: string;
  sno: string;
}
