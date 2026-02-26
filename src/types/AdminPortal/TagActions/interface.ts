import type { TagActionType } from 'utils/organizationTagsUtils';

export interface InterfaceTagActionsProps {
  tagActionsModalIsOpen: boolean;
  hideTagActionsModal: () => void;
  tagActionType: TagActionType;
}
