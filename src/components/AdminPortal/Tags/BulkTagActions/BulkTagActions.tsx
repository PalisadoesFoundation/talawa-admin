/**
 * TagActions Component
 *
 * A comprehensive modal interface for bulk assigning or removing selected members
 * across different tag folders and tags. It handles hierarchical navigation and
 * selection state for tags using a robust custom renderer.
 *
 * @param props - InterfaceTagActionsProps defining the modal state, current actions, and member IDs.
 * @returns JSX Element for the Tag Actions Modal.
 */
// translation-check-keyPrefix: manageTag
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import type { FormEvent } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from 'shared-components/Button/Button';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { useParams } from 'react-router';
import styles from './BulkTagActions.module.css';
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
import { loadFolderNode } from './tagFolderLoader';
import ActionsContent from './components/ActionsContent';
import { useBulkTagActions } from './useBulkTagActions';
import type {
  InterfaceOrganizationTagsQuery,
  InterfaceRootFolderQuery,
  InterfaceTagActionsProps,
  InterfaceTagFolderItem,
  InterfaceTagSelectionItem,
} from 'types/AdminPortal/TagActions/interface';

const TAG_ACTION_BATCH_SIZE = 10;

const BulkTagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
  tagActionType,
  assigneeIds = [],
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tOrganizationTags } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');
  const client = useApolloClient();

  const { orgId, tagId: currentTagId } = useParams();

  const [tagSearchName, setTagSearchName] = useState('');
  const [selectedTags, setSelectedTags] = useState<InterfaceTagSelectionItem[]>(
    [],
  );
  const [checkedTags, setCheckedTags] = useState<Set<string>>(new Set());
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
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

  const {
    data: orgTagsData,
    fetchMore: fetchMoreTags,
    refetch: refetchOrgTags,
  } = useQuery<InterfaceOrganizationTagsQuery>(ORGANIZATION_TAGS_WITH_FOLDER, {
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
    if (!tagActionsModalIsOpen || !orgId) {
      return;
    }

    void refetchOrgTags();
  }, [orgId, refetchOrgTags, tagActionsModalIsOpen]);

  useEffect(() => {
    if (!tagActionsModalIsOpen) {
      setFolderStateMap(new Map());
      setCheckedTags(new Set());
      setSelectedTags([]);
      setTagSearchName('');
      setCurrentFolderId(null);
      loadingFolderIdsRef.current = new Set();
    }
  }, [tagActionsModalIsOpen]);

  const tagsByFolderMap = useMemo(() => {
    const grouped = new Map<string, InterfaceTagSelectionItem[]>();
    const term = tagSearchName.trim().toLowerCase();
    const assigneeIdSet = new Set(assigneeIds);

    (orgTagsData?.organization?.tags?.edges ?? []).forEach((edge) => {
      const id = edge.node.id;
      if (id === currentTagId) {
        return;
      }

      if (tagActionType === 'removeFromTags') {
        const hasSelectedAssignee =
          edge.node.assignees?.edges?.some((assigneeEdge) =>
            assigneeIdSet.has(assigneeEdge.node.id),
          ) ?? false;

        if (!hasSelectedAssignee) {
          return;
        }
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
  }, [assigneeIds, currentTagId, orgTagsData, tagActionType, tagSearchName]);

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

  const assigneeIdsByTagId = useMemo(() => {
    const map = new Map<string, Set<string>>();

    (orgTagsData?.organization?.tags?.edges ?? []).forEach((edge) => {
      const tagId = edge.node.id;
      const assigneeIdsForTag = new Set(
        (edge.node.assignees?.edges ?? []).map(
          (assigneeEdge) => assigneeEdge.node.id,
        ),
      );

      map.set(tagId, assigneeIdsForTag);
    });

    return map;
  }, [orgTagsData]);

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
      const mutationFn =
        tagActionType === 'assignToTags' ? assignUserTag : unassignUserTag;

      const tagAssigneePairs = selectedTags.flatMap((selectedTag) => {
        if (tagActionType === 'removeFromTags') {
          const assignedAssignees =
            assigneeIdsByTagId.get(selectedTag.id) ?? new Set<string>();

          return assigneeIds
            .filter((assigneeId) => assignedAssignees.has(assigneeId))
            .map((assigneeId) => ({
              tagId: selectedTag.id,
              assigneeId,
            }));
        }

        const assignedAssignees =
          assigneeIdsByTagId.get(selectedTag.id) ?? new Set<string>();

        return assigneeIds
          .filter((assigneeId) => !assignedAssignees.has(assigneeId))
          .map((assigneeId) => ({
            tagId: selectedTag.id,
            assigneeId,
          }));
      });

      if (!tagAssigneePairs.length) {
        NotificationToast.error(t('noAssignedMembersFound'));
        return;
      }

      const batchErrors: Error[] = [];

      for (
        let batchStart = 0;
        batchStart < tagAssigneePairs.length;
        batchStart += TAG_ACTION_BATCH_SIZE
      ) {
        const batchPairs = tagAssigneePairs.slice(
          batchStart,
          batchStart + TAG_ACTION_BATCH_SIZE,
        );
        const batchPromises = batchPairs.map(({ tagId, assigneeId }) =>
          mutationFn({
            variables: {
              tagId,
              userId: assigneeId,
            },
          }),
        );

        try {
          await Promise.all(batchPromises);
        } catch {
          const batchResults = await Promise.allSettled(batchPromises);
          for (const result of batchResults) {
            if (result.status === 'rejected') {
              batchErrors.push(
                result.reason instanceof Error
                  ? result.reason
                  : new Error(String(result.reason)),
              );
            }
          }
        }
      }

      if (batchErrors.length > 0) {
        NotificationToast.error(batchErrors[0].message);
        return;
      }

      if (tagActionType === 'assignToTags') {
        NotificationToast.success(t('successfullyAssignedToTags'));
      } else {
        NotificationToast.success(t('successfullyRemovedFromTags'));
      }

      await refetchOrgTags();

      hideTagActionsModal();
      setSelectedTags([]);
      setCheckedTags(new Set());
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const ensureFolderLoaded = (folderId: string): void => {
    const folder = folderStateMap.get(folderId);

    if (!folder || folder.loading || folder.loaded) {
      return;
    }

    void loadFolderNode({
      folderId,
      loadingFolderIdsRef,
      setFolderStateMap,
      tagsByFolderMap,
      client,
      tCommon,
    });
  };

  const openFolder = (folderId: string): void => {
    setCurrentFolderId(folderId);
    ensureFolderLoaded(folderId);
  };

  const searchTerm = tagSearchName.trim().toLowerCase();

  const {
    rootFolderIds,
    currentFolder,
    breadcrumbFolderIds,
    visibleFolderIds,
    visibleTags,
  } = useBulkTagActions({
    currentFolderId,
    folderStateMap,
    searchTerm,
    tagActionType,
  });

  const hasAssignees = assigneeIds.length > 0;

  const modalFooter = (
    <>
      <Button
        variant="danger"
        onClick={hideTagActionsModal}
        data-testid="closeTagActionsModalBtn"
      >
        {tCommon('cancel')}
      </Button>
      <Button
        type="submit"
        form="tagActionForm"
        data-testid="tagActionSubmitBtn"
        variant="primary"
        disabled={!hasAssignees}
      >
        {tagActionType === 'assignToTags' ? t('move') : t('remove')}
      </Button>
    </>
  );

  return (
    <CRUDModalTemplate
      open={tagActionsModalIsOpen}
      onClose={hideTagActionsModal}
      title={
        tagActionType === 'assignToTags' ? t('moveToTags') : t('removeFromTags')
      }
      customFooter={modalFooter}
      data-testId="tagActionsModal"
    >
      <form id="tagActionForm" onSubmit={handleTagAction}>
        <div className={styles.scrollContainer}>
          {selectedTags.length === 0 ? (
            <div style={{ margin: 'auto', color: 'var(--gray-500)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <i className="fa fa-tags" style={{ fontSize: '24px', opacity: 0.5 }} />
              <span>{t('noTagSelected')}</span>
            </div>
          ) : (
            selectedTags.map((tag) => (
              <div key={tag.id} className={styles.tagBadge}>
                <span>{tag.name}</span>
                <button
                  type="button"
                  className={styles.removeMemberChipButton}
                  onClick={() => toggleTagSelection(tag, false)}
                  data-testid={`clearSelectedTag${tag.id}`}
                  aria-label={t('remove')}
                >
                  <i className="fa fa-times" aria-hidden="true" />
                </button>
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

        <ActionsContent
          hasAssignees={hasAssignees}
          currentFolderId={currentFolderId}
          breadcrumbFolderIds={breadcrumbFolderIds}
          folderStateMap={folderStateMap}
          onOpenFolder={openFolder}
          onGoToRoot={() => setCurrentFolderId(null)}
          manageTagTranslator={t}
          organizationTagsTranslator={tOrganizationTags}
          rootFoldersLoading={rootFoldersLoading}
          rootFolderIds={rootFolderIds}
          rootFoldersError={rootFoldersError}
          visibleFolderIds={visibleFolderIds}
          currentFolder={currentFolder}
          visibleTags={visibleTags}
          checkedTags={checkedTags}
          onToggleTagSelection={toggleTagSelection}
        />
      </form>
    </CRUDModalTemplate>
  );
};

export default BulkTagActions;
