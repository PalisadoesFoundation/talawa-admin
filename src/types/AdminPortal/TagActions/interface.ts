import type { TFunction } from 'i18next';
import type { TagActionType } from 'utils/organizationTagsUtils';
import { InterfaceTagData } from 'utils/interfaces';
import { useMutation } from '@apollo/client';

export interface InterfaceTagActionsProps {
  tagActionsModalIsOpen: boolean;
  hideTagActionsModal: () => void;
  tagActionType: TagActionType;
  t: TFunction<'translation', 'manageTag'>;
  tCommon: TFunction<'common', undefined>;
  availableTags: InterfaceTagData[];
  assignToTagsFn?: typeof useMutation;
  removeFromTagsFn?: typeof useMutation;
}

export const availableTags: InterfaceTagData[] = [
  {
    _id: 'Tag1',
    name: 'Tag 1',
    parentTag: { _id: 'Parent1' },
    usersAssignedTo: { totalCount: 0 },
    childTags: { totalCount: 0 },
    ancestorTags: [],
  },
  {
    _id: 'Tag2',
    name: 'Tag 2',
    parentTag: { _id: 'Parent2' },
    usersAssignedTo: { totalCount: 0 },
    childTags: { totalCount: 0 },
    ancestorTags: [],
  },
];
