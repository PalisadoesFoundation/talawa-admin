/**
 * TagFoldersHierarchy Component
 *
 * This component is responsible for managing and displaying the child folders
 * and tags of a parent folder within an organization. It provides functionality
 * to view, search, and manage child folders and tags, and maintains navigation
 * state and breadcrumb trails within the hierarchical folder structure.
 *
 * @returns The rendered TagFoldersHierarchy component.
 *
 * @remarks
 * - Uses GraphQL queries and mutations to fetch and modify tag folder data.
 * - Includes modals for creating child folders, creating child tags, and managing existing elements.
 * - Renders a unified table list merging both nested tag folders and individual tags.
 *
 * @dependencies
 * - `@apollo/client` for GraphQL operations.
 * - `react-router` for hierarchical navigation.
 * - `react-i18next` for translations.
 * - Custom components like `TableLoader`, `Toolbar`, `ManageFolderModal`, `ManageTagModal`, and `CreateModal`.
 *
 * @state
 * - `tagName`, `folderName`: Stores inputs for new tags and folders.
 * - `tagNameTouched`, `folderNameTouched`: Tracks input focus for validation errors.
 * - `managedFolder`, `managedTag`: Tracks the active folder or tag being edited/deleted.
 * - `folderSearchName`: Tracks the user's input to filter the tags/folders list.
 *
 * @methods
 * - `createTagInFolder`, `createFolderInFolder`: Handlers for triggering GraphQL creation mutations.
 * - `showCreateTagModal`, `hideCreateTagModal`: Toggles tag creation modal.
 * - `showCreateFolderModal`, `hideCreateFolderModal`: Toggles folder creation modal.
 * - `showManageFolderModal`, `hideManageFolderModal`: Manages the update modal for a specific child folder.
 * - `showManageTagModal`, `hideManageTagModal`: Manages the update modal for a specific child tag.
 * - `redirectToChildFolders`, `redirectToManageTag`: Navigation handlers for drilling down the hierarchy.
 *
 * @errorHandling
 * - Displays error messages via `NotificationToast` or inline error cards on GraphQL failures.
 *
 * @example
 * ```tsx
 * <TagFoldersHierarchy />
 * ```
 */
import { useMutation, useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useNavigate, useParams } from 'react-router';
import type { FormEvent } from 'react';
import React, { useMemo, useState } from 'react';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import Button from 'shared-components/Button';
import {
  CreateModal,
  useModalState,
} from 'shared-components/CRUDModalTemplate';

import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import styles from './FolderView.module.css';
import TableLoader from 'shared-components/TableLoader/TableLoader';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { CREATE_TAG, CREATE_TAG_FOLDER } from 'GraphQl/Mutations/TagMutations';
import {
  ORGANIZATION_TAGS_WITH_FOLDER,
  TAG_FOLDER_CHILD_FOLDERS,
} from 'GraphQl/Queries/userTagQueries';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import EditFolderModal from 'components/AdminPortal/Tags/Modals/EditFolderModal/EditFolderModal';
import EditTagModal from 'components/AdminPortal/Tags/Modals/EditTagModal/EditTagModal';
import type {
  InterfaceOrganizationTagsWithFolderQuery,
  InterfaceTagFolderChildFoldersQuery,
  InterfaceTagFolderTableRow,
} from 'types/AdminPortal/Tags/interface';

function FolderView(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');

  const createTagModal = useModalState();
  const createFolderModal = useModalState();
  const manageFolderModal = useModalState();
  const manageTagModal = useModalState();

  const { orgId, tagId: parentFolderId } = useParams();

  const navigate = useNavigate();

  const [tagName, setTagName] = useState<string>('');
  const [tagNameTouched, setTagNameTouched] = useState(false);
  const [folderName, setFolderName] = useState<string>('');
  const [folderNameTouched, setFolderNameTouched] = useState(false);
  const [managedFolder, setManagedFolder] =
    useState<InterfaceTagFolderTableRow | null>(null);
  const [managedTag, setManagedTag] =
    useState<InterfaceTagFolderTableRow | null>(null);

  const tagNameError =
    tagNameTouched && !tagName.trim() ? tCommon('required') : undefined;
  const folderNameError =
    folderNameTouched && !folderName.trim() ? tCommon('required') : undefined;

  const [folderSearchName, setFolderSearchName] = useState('');

  const showCreateTagModal = (): void => {
    createTagModal.open();
  };

  const hideCreateTagModal = (): void => {
    createTagModal.close();
    setTagName('');
    setTagNameTouched(false);
  };

  const showCreateFolderModal = (): void => {
    createFolderModal.open();
  };

  const hideCreateFolderModal = (): void => {
    createFolderModal.close();
    setFolderName('');
    setFolderNameTouched(false);
  };

  const {
    data: folderData,
    error: folderError,
    loading: folderLoading,
    refetch: folderRefetch,
  } = useQuery<InterfaceTagFolderChildFoldersQuery>(TAG_FOLDER_CHILD_FOLDERS, {
    variables: {
      input: { id: parentFolderId },
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
    },
  });

  const { data: organizationTagsData, refetch: organizationTagsRefetch } =
    useQuery<InterfaceOrganizationTagsWithFolderQuery>(
      ORGANIZATION_TAGS_WITH_FOLDER,
      {
        variables: {
          id: orgId,
          first: 32,
        },
        skip: !orgId,
      },
    );

  const [createTag, { loading: createTagLoading }] = useMutation(CREATE_TAG);
  const [createTagFolder, { loading: createFolderLoading }] =
    useMutation(CREATE_TAG_FOLDER);

  const createTagInFolder = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!tagName.trim()) {
      NotificationToast.error(tCommon('required') as string);
      return;
    }

    try {
      const { data } = await createTag({
        variables: {
          name: tagName,
          organizationId: orgId,
          folderId: parentFolderId,
        },
      });

      if (data) {
        NotificationToast.success(t('tagCreationSuccess') as string);
        await Promise.allSettled([folderRefetch(), organizationTagsRefetch()]);
        setTagName('');
        createTagModal.close();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const createFolderInFolder = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!folderName.trim()) {
      NotificationToast.error(tCommon('required') as string);
      return;
    }

    try {
      const { data } = await createTagFolder({
        variables: {
          name: folderName,
          organizationId: orgId,
          parentFolderId,
        },
      });

      if (data) {
        NotificationToast.success(t('tagCreationSuccess') as string);
        await Promise.allSettled([folderRefetch(), organizationTagsRefetch()]);
        setFolderName('');
        createFolderModal.close();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const childFoldersList =
    folderData?.tagFolder?.childFolders?.edges?.map((edge) => edge.node) ?? [];

  const parentChain = [
    folderData?.tagFolder?.parentFolder?.parentFolder?.parentFolder,
    folderData?.tagFolder?.parentFolder?.parentFolder,
    folderData?.tagFolder?.parentFolder,
  ].filter(Boolean) as Array<{ id: string; name: string }>;

  const folderBreadcrumbs = [
    ...parentChain,
    ...(folderData?.tagFolder
      ? [{ id: folderData.tagFolder.id, name: folderData.tagFolder.name }]
      : []),
  ];

  const redirectToChildFolders = (folderId: string): void => {
    navigate(`/admin/orgtags/${orgId}/tags/${folderId}`);
  };

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const showManageFolderModal = (row: InterfaceTagFolderTableRow): void => {
    setManagedFolder(row);
    manageFolderModal.open();
  };

  const showManageTagModal = (row: InterfaceTagFolderTableRow): void => {
    setManagedTag(row);
    manageTagModal.open();
  };

  const hideManageFolderModal = (): void => {
    manageFolderModal.close();
    setManagedFolder(null);
  };

  const hideManageTagModal = (): void => {
    manageTagModal.close();
    setManagedTag(null);
  };

  const tagsFromFolderResolver =
    folderData?.tagFolder?.tags?.edges?.map((edge) => edge.node) ?? [];

  const tagsFromOrganizationResolver =
    organizationTagsData?.organization?.tags?.edges
      ?.map((edge) => edge.node)
      .filter((tag) => tag.folder?.id === parentFolderId) ?? [];

  const tagsInCurrentFolder =
    tagsFromFolderResolver.length > 0
      ? tagsFromFolderResolver
      : tagsFromOrganizationResolver;

  const tagCountByFolderId = useMemo(() => {
    const counts: Record<string, number> = {};
    const organizationTags =
      organizationTagsData?.organization?.tags?.edges?.map(
        (edge) => edge.node,
      ) ?? [];

    for (const tag of organizationTags) {
      const folderId = tag.folder?.id;
      if (!folderId) continue;
      counts[folderId] = (counts[folderId] ?? 0) + 1;
    }

    return counts;
  }, [organizationTagsData]);

  const unifiedRows = useMemo(() => {
    const normalizedSearchValue = folderSearchName.trim().toLowerCase();

    const folderRows: InterfaceTagFolderTableRow[] = childFoldersList.map(
      (folder) => ({
        id: folder.id,
        name: folder.name,
        rowType: 'folder',
        createdAt: folder.createdAt,
        createdBy: folder.creator?.name,
        childFoldersCount: folder.childFolders?.edges?.length ?? 0,
        tagsCount:
          tagCountByFolderId[folder.id] ?? folder.tags?.edges?.length ?? 0,
      }),
    );

    const tagRows: InterfaceTagFolderTableRow[] = tagsInCurrentFolder.map(
      (tag) => ({
        id: tag.id,
        name: tag.name,
        rowType: 'tag',
        createdAt: tag.createdAt,
        createdBy: tag.creator?.name,
      }),
    );

    const rows = [...folderRows, ...tagRows].filter((row) =>
      row.name.toLowerCase().includes(normalizedSearchValue),
    );

    return rows;
  }, [
    childFoldersList,
    tagsInCurrentFolder,
    folderSearchName,
    tagCountByFolderId,
  ]);

  const formatCreatedAt = (value?: string | null): string => {
    if (!value) return '--';

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return '--';

    return parsedDate.toLocaleDateString();
  };

  const rowIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    unifiedRows.forEach((row, index) => {
      map.set(row.id, index + 1);
    });
    return map;
  }, [unifiedRows]);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div
            className={styles.pageBreadcrumb}
            data-testid="organizationTagsRootBreadcrumb"
            style={{ marginBottom: 'var(--space-3)' }}
          >
            <Button
              type="button"
              variant="text"
              onClick={() => navigate(`/admin/orgtags/${orgId}`)}
              className={styles.breadcrumbLinkButton}
              data-testid="allTagsBtn"
            >
              {t('tags')}
            </Button>
            {folderBreadcrumbs.map((tag) => (
              <React.Fragment key={tag.id}>
                <span className={styles.breadcrumbDivider}>/</span>
                {tag.id === parentFolderId ? (
                  <span className={styles.breadcrumbCurrent}>{tag.name}</span>
                ) : (
                  <Button
                    type="button"
                    variant="text"
                    className={styles.breadcrumbLinkButton}
                    onClick={() => redirectToChildFolders(tag.id)}
                    data-testid="redirectToChildFolders"
                  >
                    {tag.name}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
          <h1 className="page-title">
            {folderBreadcrumbs[folderBreadcrumbs.length - 1]?.name ?? t('tags')}
          </h1>
          <p className="page-subtitle">
            {tCommon('manage')}{' '}
            {folderBreadcrumbs[folderBreadcrumbs.length - 1]?.name ?? t('tags')}
          </p>
        </div>
        <div
          className="page-header-actions"
          style={{ gap: '12px', display: 'flex' }}
        >
          <button
            className="btn btn-secondary"
            onClick={showCreateFolderModal}
            data-testid="addFolderBtn"
          >
            + {t('addChildTag')}
          </button>
          <button
            className="btn btn-primary"
            onClick={showCreateTagModal}
            data-testid="addTagBtn"
          >
            + {t('createTagInFolder')}
          </button>
        </div>
      </div>

      <div
        className="toolbar"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <input
          type="text"
          className="search-input"
          placeholder={tCommon('searchByName')}
          value={folderSearchName}
          onChange={(e) => setFolderSearchName(e.target.value.trim())}
          data-testid="searchByName"
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
          }}
        />
      </div>

      {folderError ? (
        <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
          <div className={styles.errorMessage}>
            <WarningAmberRounded className={styles.errorIcon} />
            <h6 className="fw-bold text-danger text-center">
              {tCommon('errorOccured')}
            </h6>
          </div>
        </div>
      ) : (
        <div>
          {folderLoading ? (
            <TableLoader
              headerTitles={[
                tCommon('sl_no'),
                t('tagName'),
                t('type'),
                t('total'),
                t('createdBy'),
                t('createdAt'),
                tCommon('actions'),
              ]}
              noOfRows={PAGE_SIZE}
            />
          ) : unifiedRows.length === 0 ? (
            <div className="card">
              <EmptyState
                icon="Tag"
                message={t('noTagsFound')}
                dataTestId="tags-empty-state"
              />
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table" aria-label={t('tags')}>
                <thead>
                  <tr>
                    <th scope="col">{tCommon('sl_no')}</th>
                    <th scope="col">{t('tagName')}</th>
                    <th scope="col">{t('type')}</th>
                    <th scope="col">{t('total')}</th>
                    <th scope="col">{t('createdBy')}</th>
                    <th scope="col">{t('createdAt')}</th>
                    <th scope="col">{tCommon('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {unifiedRows.map((row) => {
                    const isFolder = row.rowType === 'folder';
                    return (
                      <tr key={row.id}>
                        <td>
                          <span className={styles.tableItemIndex}>
                            {(rowIndexMap.get(row.id) ?? 0).toString()}.
                          </span>
                        </td>
                        <td>
                          {isFolder ? (
                            <button
                              className={`btn btn-link ${styles.folderNameButton}`}
                              style={{
                                padding: 0,
                                textDecoration: 'none',
                                color: 'var(--primary-color, #10b981)',
                              }}
                              data-testid="tagName"
                              onClick={() => redirectToChildFolders(row.id)}
                            >
                              <i
                                className={`fa fa-folder ${styles.nameIcon}`}
                                style={{ marginRight: 'var(--space-2)' }}
                                aria-hidden="true"
                              />
                              {row.name}
                            </button>
                          ) : (
                            <button
                              className={`btn btn-link ${styles.folderNameButton}`}
                              style={{
                                padding: 0,
                                textDecoration: 'none',
                                color: 'var(--primary-color, #10b981)',
                              }}
                              data-testid="tagName"
                              onClick={() => redirectToManageTag(row.id)}
                            >
                              <i
                                className={`fa fa-tag ${styles.nameIcon}`}
                                style={{ marginRight: 'var(--space-2)' }}
                                aria-hidden="true"
                              />
                              {row.name}
                            </button>
                          )}
                        </td>
                        <td>
                          <span
                            className={
                              isFolder ? styles.folderBadge : styles.tagBadge
                            }
                          >
                            {isFolder ? t('folderType') : t('tagType')}
                          </span>
                        </td>
                        <td>
                          {isFolder ? (
                            <span className={styles.assigneesMeta}>
                              {t('child', {
                                count: row.childFoldersCount ?? 0,
                              })}{' '}
                              · {t('tags', { count: row.tagsCount ?? 0 })}
                            </span>
                          ) : (
                            <span className={styles.assigneesMeta}>-</span>
                          )}
                        </td>
                        <td>
                          <span className={styles.assigneesMeta}>
                            {row.createdBy ?? '--'}
                          </span>
                        </td>
                        <td>
                          <span className={styles.assigneesMeta}>
                            {formatCreatedAt(row.createdAt ?? null)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              isFolder
                                ? showManageFolderModal(row)
                                : showManageTagModal(row)
                            }
                            data-testid="manageTagBtn"
                            aria-label={`${tCommon('edit')} ${row.name ?? ''}`.trim()}
                          >
                            <i
                              className="fa fa-edit"
                              style={{ marginRight: 'var(--space-2)' }}
                              aria-hidden="true"
                            />
                            {tCommon('edit')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <CreateModal
        open={createFolderModal.isOpen}
        onClose={hideCreateFolderModal}
        title={t('addChildTag')}
        onSubmit={createFolderInFolder}
        loading={createFolderLoading}
        submitDisabled={Boolean(folderNameError)}
        data-testid="createFolderInFolderModal"
        className={styles.folderCreateModal}
      >
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <FormTextField
            name="folderName"
            label={t('folderName')}
            placeholder={t('folderNamePlaceholder')}
            value={folderName}
            onChange={(val) => {
              setFolderName(val);
              if (!folderNameTouched) setFolderNameTouched(true);
            }}
            onBlur={() => setFolderNameTouched(true)}
            touched={folderNameTouched}
            error={folderNameError}
            required
            data-testid="createFolderNameInput"
            autoComplete="off"
          />
        </div>
      </CreateModal>

      <CreateModal
        open={createTagModal.isOpen}
        onClose={hideCreateTagModal}
        title={t('tagDetailsModal')}
        onSubmit={createTagInFolder}
        loading={createTagLoading}
        submitDisabled={Boolean(tagNameError)}
        data-testid="createTagInFolderModal"
        className={styles.folderCreateModal}
      >
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <FormTextField
            name="tagName"
            label={t('tagLabel')}
            placeholder={t('tagNamePlaceholderInFolder')}
            value={tagName}
            onChange={(val) => {
              setTagName(val);
              if (!tagNameTouched) setTagNameTouched(true);
            }}
            onBlur={() => setTagNameTouched(true)}
            touched={tagNameTouched}
            error={tagNameError}
            required
            data-testid="createTagNameInput"
            autoComplete="off"
          />
        </div>
      </CreateModal>

      <EditFolderModal
        open={manageFolderModal.isOpen}
        folder={managedFolder}
        onClose={hideManageFolderModal}
        onRefetch={folderRefetch}
        modalTestId="manageChildFolderModal"
        inputTestId="manageFolderNameInput"
        deleteModalTestId="delete-child-tag-folder-modal"
      />

      <EditTagModal
        open={manageTagModal.isOpen}
        tag={managedTag}
        onClose={hideManageTagModal}
        onRefetch={folderRefetch}
        modalTestId="manageTagModal"
        inputTestId="manageTagNameInput"
        deleteModalTestId="delete-tag-modal"
      />
    </div>
  );
}

export default FolderView;
