/**
 * Component for managing tag actions such as assigning or removing tags
 * for users within an organization. It provides a modal interface for
 * selecting tags, searching tags, and performing the desired action.
 *
 * @param props - The props for the component, which include:
 *   - tagActionsModalIsOpen: Determines if the modal is open
 *   - hideTagActionsModal: Function to close the modal
 *   - tagActionType: The type of action to perform ('assignToTags' or 'removeFromTags')
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
 * />
 * ```
 *
 */
// translation-check-keyPrefix: manageTag
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import type { FormEvent } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from 'shared-components/Button/Button';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { useParams } from 'react-router';
import styles from './TagActions.module.css';
import {
  ORGANIZATION_TAGS_AND_FOLDERS,
  ORGANIZATION_TAGS_WITH_FOLDER,
} from 'GraphQl/Queries/userTagQueries';
import {
  ADD_PEOPLE_TO_TAG,
  UNASSIGN_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
import { getRootFolderIds, renderFolderTree } from './tagTreeRenderer';
import { loadFolderNode } from './tagFolderLoader';
import type {
  InterfaceOrganizationTagsQuery,
  InterfaceRootFolderQuery,
  InterfaceTagActionsProps,
  InterfaceTagFolderItem,
  InterfaceTagSelectionItem,
} from 'types/AdminPortal/TagActions/interface';

const TagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
  tagActionType,
  assigneeIds = [],
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tCommon } = useTranslation('common');
  const client = useApolloClient();

  const { orgId, tagId: currentTagId } = useParams();

  const [tagSearchName, setTagSearchName] = useState('');
  const [selectedTags, setSelectedTags] = useState<InterfaceTagSelectionItem[]>(
    [],
  );
  const [checkedTags, setCheckedTags] = useState<Set<string>>(new Set());
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    new Set(),
  );
  const [folderStateMap, setFolderStateMap] = useState<
    Map<string, InterfaceTagFolderItem>
  >(new Map());
  const autoPaginatingRef = useRef(false);
  const loadingFolderIdsRef = useRef<Set<string>>(new Set());

  const {
    data: rootFoldersData,
    loading: rootFoldersLoading,
    error: rootFoldersError,
    fetchMore,
  } = useQuery<InterfaceRootFolderQuery>(ORGANIZATION_TAGS_AND_FOLDERS, {
    variables: {
      id: orgId,
      tagFoldersFirst: 32,
    },
    skip: !tagActionsModalIsOpen || !orgId,
  });

  const { data: orgTagsData, fetchMore: fetchMoreTags } =
    useQuery<InterfaceOrganizationTagsQuery>(ORGANIZATION_TAGS_WITH_FOLDER, {
      variables: {
        id: orgId,
        first: 32,
      },
      skip: !tagActionsModalIsOpen || !orgId,
    });

  useEffect(() => {
    if (!tagActionsModalIsOpen || !orgId || !rootFoldersData?.organization) {
      return;
    }

    const foldersPageInfo = rootFoldersData.organization.tagFolders?.pageInfo;

    if (!foldersPageInfo?.hasNextPage) {
      return;
    }

    if (autoPaginatingRef.current) {
      return;
    }

    autoPaginatingRef.current = true;

    void fetchMore({
      variables: {
        id: orgId,
        tagFoldersAfter: foldersPageInfo.endCursor,
        tagFoldersFirst: 32,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.organization) {
          return prev;
        }

        const prevFolders = prev.organization?.tagFolders?.edges ?? [];
        const nextFolders =
          fetchMoreResult.organization.tagFolders?.edges ?? [];
        const mergedFoldersById = new Map(
          prevFolders.map((edge) => [edge.node.id, edge]),
        );
        nextFolders.forEach((edge) =>
          mergedFoldersById.set(edge.node.id, edge),
        );

        return {
          ...prev,
          organization: {
            ...prev.organization,
            ...fetchMoreResult.organization,
            tagFolders: {
              ...prev.organization?.tagFolders,
              ...fetchMoreResult.organization.tagFolders,
              edges: Array.from(mergedFoldersById.values()),
            },
          },
        };
      },
    }).finally(() => {
      autoPaginatingRef.current = false;
    });
  }, [fetchMore, orgId, rootFoldersData, tagActionsModalIsOpen]);

  useEffect(() => {
    if (!tagActionsModalIsOpen || !orgId || !orgTagsData?.organization) {
      return;
    }

    const tagsPageInfo = orgTagsData.organization.tags?.pageInfo;
    if (!tagsPageInfo?.hasNextPage) {
      return;
    }

    if (autoPaginatingRef.current) {
      return;
    }

    autoPaginatingRef.current = true;

    void fetchMoreTags({
      variables: {
        id: orgId,
        after: tagsPageInfo.endCursor,
        first: 32,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.organization) {
          return prev;
        }

        const prevTags = prev.organization?.tags?.edges ?? [];
        const nextTags = fetchMoreResult.organization.tags?.edges ?? [];
        const mergedTagsById = new Map(
          prevTags.map((edge) => [edge.node.id, edge]),
        );
        nextTags.forEach((edge) => mergedTagsById.set(edge.node.id, edge));

        return {
          ...prev,
          organization: {
            ...prev.organization,
            ...fetchMoreResult.organization,
            tags: {
              ...prev.organization?.tags,
              ...fetchMoreResult.organization.tags,
              edges: Array.from(mergedTagsById.values()),
            },
          },
        };
      },
    }).finally(() => {
      autoPaginatingRef.current = false;
    });
  }, [fetchMoreTags, orgId, orgTagsData, tagActionsModalIsOpen]);

  useEffect(() => {
    if (!tagActionsModalIsOpen) {
      return;
    }

    const rootFolders = rootFoldersData?.organization?.tagFolders?.edges ?? [];

    if (!rootFolders.length) {
      return;
    }

    setFolderStateMap((prev) => {
      const next = new Map(prev);

      rootFolders.forEach(({ node }) => {
        const existing = next.get(node.id);

        next.set(node.id, {
          id: node.id,
          name: node.name,
          parentFolderId: node.parentFolder?.id ?? null,
          childFolderIds: existing?.childFolderIds ?? [],
          tags: existing?.tags ?? [],
          loaded: existing?.loaded ?? false,
          loading: existing?.loading ?? false,
        });
      });

      return next;
    });
  }, [rootFoldersData, tagActionsModalIsOpen]);

  useEffect(() => {
    if (!tagActionsModalIsOpen) {
      setFolderStateMap(new Map());
      setExpandedFolderIds(new Set());
      setCheckedTags(new Set());
      setSelectedTags([]);
      setTagSearchName('');
      loadingFolderIdsRef.current = new Set();
    }
  }, [tagActionsModalIsOpen]);

  const tagsByFolderMap = useMemo(() => {
    const grouped = new Map<string, InterfaceTagSelectionItem[]>();
    const term = tagSearchName.trim().toLowerCase();

    (orgTagsData?.organization?.tags?.edges ?? []).forEach((edge) => {
      const id = edge.node.id;
      if (id === currentTagId) {
        return;
      }

      const name = edge.node.name;
      if (term && !name.toLowerCase().includes(term)) {
        return;
      }

      const folderId = edge.node.folder?.id;
      if (!folderId) {
        return;
      }

      const list = grouped.get(folderId) ?? [];
      list.push({ id, name });
      grouped.set(folderId, list);
    });

    return grouped;
  }, [currentTagId, orgTagsData, tagSearchName]);

  useEffect(() => {
    setFolderStateMap((prev) => {
      const next = new Map(prev);

      next.forEach((folder, id) => {
        next.set(id, {
          ...folder,
          tags: tagsByFolderMap.get(id) ?? [],
        });
      });

      return next;
    });
  }, [tagsByFolderMap]);

  const [assignUserTag] = useMutation(ADD_PEOPLE_TO_TAG);
  const [unassignUserTag] = useMutation(UNASSIGN_USER_TAG);

  const toggleTagSelection = (
    tag: InterfaceTagSelectionItem,
    isSelected: boolean,
  ): void => {
    const nextChecked = new Set(checkedTags);

    if (isSelected) {
      nextChecked.add(tag.id);
      setSelectedTags((prev) => [...prev, tag]);
    } else {
      nextChecked.delete(tag.id);
      setSelectedTags((prev) =>
        prev.filter((selected) => selected.id !== tag.id),
      );
    }

    setCheckedTags(nextChecked);
  };

  const handleTagAction = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!selectedTags.length) {
      NotificationToast.error(t('noTagSelected'));
      return;
    }

    if (!assigneeIds.length) {
      NotificationToast.error(t('noAssignedMembersFound'));
      return;
    }

    try {
      for (const selectedTag of selectedTags) {
        for (const assigneeId of assigneeIds) {
          if (tagActionType === 'assignToTags') {
            await assignUserTag({
              variables: {
                tagId: selectedTag.id,
                userId: assigneeId,
              },
            });
          } else {
            await unassignUserTag({
              variables: {
                tagId: selectedTag.id,
                userId: assigneeId,
              },
            });
          }
        }
      }

      if (tagActionType === 'assignToTags') {
        NotificationToast.success(t('successfullyAssignedToTags'));
      } else {
        NotificationToast.success(t('successfullyRemovedFromTags'));
      }

      hideTagActionsModal();
      setSelectedTags([]);
      setCheckedTags(new Set());
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const searchTerm = tagSearchName.trim().toLowerCase();

  const rootFolderIds = useMemo(
    () => getRootFolderIds(folderStateMap),
    [folderStateMap],
  );

  const toggleFolderExpansion = (folderId: string): void => {
    const shouldExpand = !expandedFolderIds.has(folderId);

    setExpandedFolderIds((prev) => {
      const next = new Set(prev);

      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }

      return next;
    });

    if (!shouldExpand) {
      return;
    }

    const folder = folderStateMap.get(folderId);
    if (
      folder &&
      !folder.loading &&
      (!folder.loaded ||
        (folder.loaded &&
          folder.childFolderIds.length === 0 &&
          folder.tags.length === 0))
    ) {
      void loadFolderNode({
        folderId,
        loadingFolderIdsRef,
        setFolderStateMap,
        tagsByFolderMap,
        client,
        tCommon,
      });
    }
  };

  const modalFooter = (
    <>
      <Button
        variant="outline-danger"
        className={styles.removeButton}
        onClick={hideTagActionsModal}
        data-testid="closeTagActionsModalBtn"
      >
        {tCommon('cancel')}
      </Button>
      <Button
        type="submit"
        form="tagActionForm"
        data-testid="tagActionSubmitBtn"
        className={styles.addButton}
      >
        {tagActionType === 'assignToTags' ? t('assign') : t('remove')}
      </Button>
    </>
  );

  return (
    <CRUDModalTemplate
      open={tagActionsModalIsOpen}
      onClose={hideTagActionsModal}
      title={
        tagActionType === 'assignToTags'
          ? t('assignToTags')
          : t('removeFromTags')
      }
      customFooter={modalFooter}
      data-testId="tagActionsModal"
    >
      <form id="tagActionForm" onSubmit={handleTagAction}>
        <div
          className={`d-flex flex-wrap align-items-center border border-2 border-dark-subtle bg-light-subtle rounded-3 p-2 ${styles.scrollContainer}`}
        >
          {selectedTags.length === 0 ? (
            <div className="text-body-tertiary mx-auto">
              {t('noTagSelected')}
            </div>
          ) : (
            selectedTags.map((tag) => (
              <div key={tag.id} className={styles.memberBadge}>
                {tag.name}
                <Button
                  type="button"
                  className={styles.removeMemberChipButton}
                  onClick={() => toggleTagSelection(tag, false)}
                  data-testid={`clearSelectedTag${tag.id}`}
                  aria-label={t('remove')}
                >
                  <i className="fa fa-times" aria-hidden="true" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className={styles.searchSection}>
          <SearchBar
            placeholder={tCommon('searchByName')}
            value={tagSearchName}
            onChange={(value) => setTagSearchName(value.trim())}
            onSearch={(value) => setTagSearchName(value.trim())}
            inputTestId="searchByName"
            showSearchButton={false}
            showLeadingIcon
            showClearButton
          />
        </div>

        <div className={styles.listTitle}>{t('allTags')}</div>

        <ul
          id="scrollableDiv"
          data-testid="scrollableDiv"
          className={styles.tagActionsScrollableDiv}
          aria-label={t('allTags')}
        >
          {rootFoldersLoading && rootFolderIds.length === 0 ? (
            <div className={styles.loadingDiv}>
              <InfiniteScrollLoader />
            </div>
          ) : rootFoldersError ? (
            <div
              className="text-danger mx-auto"
              data-testid="tagsQueryErrorMessage"
            >
              {rootFoldersError.message}
            </div>
          ) : rootFolderIds.length === 0 ? (
            <div
              className="text-body-tertiary mx-auto"
              data-testid="noTagsFoundMessage"
            >
              {t('noTagsFound')}
            </div>
          ) : (
            rootFolderIds.flatMap((folderId) =>
              renderFolderTree(folderId, 0, {
                folderStateMap,
                expandedFolderIds,
                checkedTags,
                searchTerm,
                styles,
                onToggleFolderExpansion: toggleFolderExpansion,
                onToggleTagSelection: toggleTagSelection,
                noTagsFoundText: t('noTagsFound'),
              }),
            )
          )}
        </ul>
      </form>
    </CRUDModalTemplate>
  );
};

export default TagActions;
