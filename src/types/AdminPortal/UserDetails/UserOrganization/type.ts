export type UserOrganizationProps = { id?: string };
export type OrgRelationType = 'CREATED' | 'BELONG_TO' | 'JOINED';

export type UserOrg = {
  id: string;
  name: string;
  relation: OrgRelationType;
  adminsCount: number;
  membersCount: number;
  description?: string;
  avatarURL?: string;
};
