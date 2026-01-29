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
import SearchBar from 'shared-components/SearchBar/SearchBar';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useParams } from 'react-router';
import type { InterfaceTagData } from 'utils/interfaces';
import styles from './TagActions.module.css';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import {
  ASSIGN_TO_TAGS,
  REMOVE_FROM_TAGS,
} from 'GraphQl/Mutations/TagMutations';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import TagNode from './Node/TagNode';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
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
}) => {
  const { orgId, tagId: currentTagId } = useParams();

  const [tagSearchName, setTagSearchName] = useState('');

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

  const toggleTagSelection = (
    tag: InterfaceTagData,
    isSelected: boolean,
  ): void => {
    if (isSelected) {
      selectTag(tag);
    } else {
      deSelectTag(tag);
    }
  };

  const [assignToTags] = useMutation(ASSIGN_TO_TAGS);
  const [removeFromTags] = useMutation(REMOVE_FROM_TAGS);

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
        show={tagActionsModalIsOpen}
        onHide={hideTagActionsModal}
        backdrop="static"
        centered
        title={
          tagActionType === 'assignToTags'
            ? t('assignToTags')
            : t('removeFromTags')
        }
        headerClassName={styles.modalHeader}
        dataTestId="modalOrganizationHeader"
        footer={
          <>
            <Button
              className={`btn btn-danger ${styles.removeButton}`}
              onClick={(): void => hideTagActionsModal()}
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
          <div className="pb-0">
            <div
              className={`d-flex flex-wrap align-items-center border border-2 border-dark-subtle bg-light-subtle rounded-3 p-2 ${styles.scrollContainer}`}
            >
              {selectedTags.length === 0 ? (
                <div className="text-body-tertiary mx-auto">
                  {t('noTagSelected')}
                </div>
              ) : (
                selectedTags.map((tag: InterfaceTagData) => (
                  <div
                    key={tag._id}
                    className={`badge bg-dark-subtle text-secondary-emphasis lh-lg my-2 ms-2 d-flex align-items-center ${styles.tagBadge}`}
                  >
                    {tag.name}
                    <button
                      className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary border-0 bg-transparent`}
                      onClick={() => deSelectTag(tag)}
                      data-testid={`clearSelectedTag${tag._id}`}
                      aria-label={t('remove')}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="mt-3">
              <SearchBar
                value={tagSearchName}
                onChange={(val) => setTagSearchName(val.trim())}
                placeholder={tCommon('searchByName')}
                inputTestId="searchByName"
                autoComplete="off"
                showSearchButton={false}
                showLeadingIcon={true}
                inputClassName={styles.inputField}
              />
            </div>

            <div className="mt-3 mb-2 fs-5 fw-semibold text-dark-emphasis">
              {t('allTags')}
            </div>
            <ul
              id="scrollableDiv"
              data-testid="scrollableDiv"
              className={styles.tagActionsScrollableDiv}
              aria-label={t('allTags')}
            >
              {tagActionsModalIsOpen && (
                <CursorPaginationManager
                  query={ORGANIZATION_USER_TAGS_LIST}
                  queryVariables={{
                    id: orgId,
                    where: { name: { starts_with: tagSearchName } },
                  }}
                  dataPath="organizations.0.userTags"
                  itemsPerPage={TAGS_QUERY_DATA_CHUNK_SIZE}
                  renderItem={(tag: InterfaceTagData) => (
                    <li key={tag._id} className="position-relative w-100">
                      <div
                        className="d-inline-block w-100"
                        data-testid="orgUserTag"
                      >
                        <TagNode
                          tag={tag}
                          checkedTags={checkedTags}
                          toggleTagSelection={toggleTagSelection}
                          t={t}
                        />
                      </div>

                      {/* Ancestor tags breadcrumbs positioned at the end of TagNode */}
                      {tag.parentTag && (
                        <div className="position-absolute end-0 top-0 d-flex flex-row mt-2 me-3 pt-0 text-secondary">
                          <>{'('}</>
                          {tag.ancestorTags?.map((ancestorTag) => (
                            <span
                              key={ancestorTag._id}
                              className="ms-2 my-0"
                              data-testid="ancestorTagsBreadCrumbs"
                            >
                              {ancestorTag.name}
                              <i className="ms-2 fa fa-caret-right" />
                            </span>
                          ))}
                          <>{')'}</>
                        </div>
                      )}
                    </li>
                  )}
                  keyExtractor={(tag: InterfaceTagData) => tag._id}
                  loadingComponent={
                    <div className={styles.loadingDiv}>
                      <InfiniteScrollLoader />
                    </div>
                  }
                  emptyStateComponent={
                    <div
                      className="text-body-tertiary mx-auto"
                      data-testid="noTagsFoundMessage"
                    >
                      {t('noTagsFound')}
                    </div>
                  }
                />
              )}
            </ul>
          </div>
        </form>
      </BaseModal>
    </>
  );
};

export default TagActions;
