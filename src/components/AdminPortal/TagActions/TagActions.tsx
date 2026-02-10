/**
 * Component for managing tag actions such as assigning or removing tags
 * for users within an organization. It provides a modal interface for
 * selecting tags, searching tags, and performing the desired action.
 *
 * @param props - The props for the component, which include:
 *   - tagActionsModalIsOpen: Determines if the modal is open
 *   - hideTagActionsModal: Function to close the modal
 *   - tagActionType: The type of action to perform ('assignToTags' or 'removeFromTags')
 *   - t: Translation function for managing tags
 *   - tCommon: Common translation function
 *
 * @returns A React functional component.
 *
 * @remarks
 * - Uses Apollo Client's useQuery and useMutation hooks for fetching and mutating data.
 * - Uses CursorPaginationManager for standardized pagination with load more functionality.
 * - Handles ancestor tags to ensure hierarchical consistency when selecting or deselecting tags.
 * - ancestorTagsDataMap tracks reference counts for ancestor tags (state used internally, never read directly).
 *
 * @example
 * ```tsx
 * <TagActions
 *   tagActionsModalIsOpen={true}
 *   hideTagActionsModal={() => setModalOpen(false)}
 *   tagActionType="assignToTags"
 *   t={t}
 *   tCommon={tCommon}
 * />
 * ```
 *
 */
// translation-check-keyPrefix: manageTag
import { useMutation } from '@apollo/client';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import Button from 'shared-components/Button';
import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { useParams } from 'react-router';
import type { InterfaceTagData } from 'utils/interfaces';
import styles from './TagActions.module.css';
import {
  ASSIGN_TO_TAGS,
  REMOVE_FROM_TAGS,
} from 'GraphQl/Mutations/TagMutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { InterfaceTagActionsProps } from 'types/AdminPortal/TagActions/interface';

interface InterfaceUserTagsAncestorData {
  _id: string;
  name: string;
}

const TagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
  tagActionType,
  t,
  tCommon,
  availableTags,
  assignToTagsFn,
  removeFromTagsFn,
}) => {
  const { tagId: currentTagId } = useParams();

  // tags that we have selected to assigned
  const [selectedTags, setSelectedTags] = useState<InterfaceTagData[]>([]);

  // tags that we have checked, it is there to differentiate between the selected tags and all the checked tags
  // i.e. selected tags would only be the ones we select, but checked tags will also include the selected tag's ancestors
  const [checkedTags, setCheckedTags] = useState<Set<string>>(new Set());

  // next 3 states are there to keep track of the ancestor tags of the the tags that we have selected
  // i.e. when we check a tag, all of it's ancestor tags will be checked too
  // indicating that the users will be assigned all of the ancestor tags as well
  const [addAncestorTagsData, setAddAncestorTagsData] = useState<
    Set<InterfaceUserTagsAncestorData>
  >(new Set());
  const [removeAncestorTagsData, setRemoveAncestorTagsData] = useState<
    Set<InterfaceUserTagsAncestorData>
  >(new Set());
  /**
   * Tracks reference counts for ancestor tags to maintain hierarchical consistency.
   * Updated by two useEffect hooks (one for additions, one for removals) to manage
   * the count of selected tags that share each ancestor. When count reaches zero,
   * the ancestor is removed from checkedTags. Never read directly in render.
   */
  const [ancestorTagsDataMap, setAncestorTagsDataMap] = useState<
    Map<string, number>
  >(new Map());

  // Dummy use to satisfy linter (ancestorTagsDataMap is only written, never read directly)
  void ancestorTagsDataMap;

  useEffect(() => {
    setAncestorTagsDataMap((prevMap) => {
      const newMap = new Map(prevMap);

      addAncestorTagsData.forEach((ancestorTag) => {
        const prevValue = prevMap.get(ancestorTag._id);
        if (prevValue !== undefined) {
          newMap.set(ancestorTag._id, prevValue + 1);
        } else {
          newMap.set(ancestorTag._id, 1);
        }
      });

      if (addAncestorTagsData.size > 0) {
        setCheckedTags((prev) => {
          const next = new Set(prev);
          addAncestorTagsData.forEach((ancestorTag) => {
            next.add(ancestorTag._id);
          });
          return next;
        });
      }

      return newMap;
    });
  }, [addAncestorTagsData]);

  useEffect(() => {
    // Compute what needs to be deleted first (pure computation)
    setAncestorTagsDataMap((prevMap) => {
      const newMap = new Map(prevMap);
      const tagsToDelete: string[] = [];

      removeAncestorTagsData.forEach((ancestorTag) => {
        const prevValue = prevMap.get(ancestorTag._id);
        // Defensively check prevValue - if null/undefined, treat as 0 (deletion)
        if (prevValue === undefined || prevValue === null) {
          newMap.delete(ancestorTag._id);
          tagsToDelete.push(ancestorTag._id);
        } else if (prevValue === 1) {
          newMap.delete(ancestorTag._id);
          tagsToDelete.push(ancestorTag._id);
        } else if (prevValue > 1) {
          newMap.set(ancestorTag._id, prevValue - 1);
        }
      });

      if (tagsToDelete.length > 0) {
        setCheckedTags((prev) => {
          const next = new Set(prev);
          tagsToDelete.forEach((id) => next.delete(id));
          return next;
        });
      }

      return newMap;
    });
  }, [removeAncestorTagsData]);

  const selectTag = (tag: InterfaceTagData): void => {
    const newCheckedTags = new Set(checkedTags);

    setSelectedTags((selectedTags) => [...selectedTags, tag]);
    newCheckedTags.add(tag._id);

    setAddAncestorTagsData(new Set(tag.ancestorTags));

    setCheckedTags(newCheckedTags);
  };

  const deSelectTag = (tag: InterfaceTagData): void => {
    if (!selectedTags.some((selectedTag) => selectedTag._id === tag._id)) {
      return;
    }

    const newCheckedTags = new Set(checkedTags);

    setSelectedTags(
      selectedTags.filter((selectedTag) => selectedTag._id !== tag._id),
    );
    newCheckedTags.delete(tag._id);

    setRemoveAncestorTagsData(new Set(tag.ancestorTags));

    setCheckedTags(newCheckedTags);
  };

  const _toggleTagSelection = (
    tag: InterfaceTagData,
    isSelected: boolean,
  ): void => {
    if (isSelected) {
      selectTag(tag);
    } else {
      deSelectTag(tag);
    }
  };

  const [assignToTags] =
    assignToTagsFn?.(ASSIGN_TO_TAGS) ?? useMutation(ASSIGN_TO_TAGS);
  const [removeFromTags] =
    removeFromTagsFn?.(REMOVE_FROM_TAGS) ?? useMutation(REMOVE_FROM_TAGS);

  const handleTagAction = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!selectedTags.length) {
      NotificationToast.error(t('noTagSelected'));
      return;
    }

    const mutationObject = {
      variables: {
        currentTagId,
        selectedTagIds: selectedTags.map((selectedTag) => selectedTag._id),
      },
    };

    try {
      const { data } =
        tagActionType === 'assignToTags'
          ? await assignToTags(mutationObject)
          : await removeFromTags(mutationObject);

      if (data) {
        if (tagActionType === 'assignToTags') {
          NotificationToast.success(t('successfullyAssignedToTags'));
        } else {
          NotificationToast.success(t('successfullyRemovedFromTags'));
        }
        hideTagActionsModal();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  return (
    <>
      <BaseModal
        open={tagActionsModalIsOpen}
        onClose={hideTagActionsModal}
        centered
        title={
          tagActionType === 'assignToTags'
            ? t('assignToTags')
            : t('removeFromTags')
        }
        data-testId="modalOrganizationHeader"
        customFooter={
          <>
            <Button
              className={`btn btn-danger ${styles.removeButton}`}
              onClick={hideTagActionsModal}
              data-testid="closeTagActionsModalBtn"
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              value="add"
              form="tagActionForm"
              data-testid="tagActionSubmitBtn"
              className={`btn ${styles.addButton}`}
            >
              {tagActionType === 'assignToTags' ? t('assign') : t('remove')}
            </Button>
          </>
        }
      >
        <form id="tagActionForm" onSubmit={handleTagAction}>
          {availableTags.map((tag) => (
            <div key={tag._id}>
              <label>
                <input
                  type="checkbox"
                  checked={checkedTags.has(tag._id)}
                  onChange={() =>
                    _toggleTagSelection(tag, !checkedTags.has(tag._id))
                  }
                  data-testid={`check${tag._id}`}
                />
                {tag.name}
              </label>
            </div>
          ))}
        </form>
      </BaseModal>
    </>
  );
};

export default TagActions;
