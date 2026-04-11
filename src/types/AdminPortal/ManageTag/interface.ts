import type { InterfaceQueryUserTagsAssignedMembers } from 'utils/interfaces';

export interface InterfaceManageTagQueryData {
  getAssignedUsers: InterfaceQueryUserTagsAssignedMembers;
}

export interface InterfaceAssignedMemberRow {
  _id: string;
  name: string;
}
