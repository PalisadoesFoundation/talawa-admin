export type InterfaceUserOrganizationsProps = { id?: string };
export type InterfaceOrgRelationType = 'CREATED' | 'BELONG_TO' | 'JOINED';

export type InterfaceUserOrg = {
  id: string;
  name: string;
  relation: InterfaceOrgRelationType;
  adminsCount: number;
  membersCount: number;
  description?: string;
  avatarURL?: string;
};
