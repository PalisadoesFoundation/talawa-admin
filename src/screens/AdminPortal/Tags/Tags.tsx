/**
 * SubTags Component
 *
 * This component is responsible for managing and displaying the sub-tags
 * of a parent tag within an organization. It provides functionality to
 * view, search, and manage tags/folders within a folder hierarchy.
 *
 * @returns The rendered SubTags component.
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
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import styles from './Tags.module.css';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { CREATE_TAG, CREATE_TAG_FOLDER } from 'GraphQl/Mutations/TagMutations';
import {
  ORGANIZATION_TAGS_WITH_FOLDER,
  TAG_FOLDER_CHILD_FOLDERS,
} from 'GraphQl/Queries/userTagQueries';
import Toolbar from 'shared-components/Toolbar/Toolbar';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import ManageFolderModal from 'screens/AdminPortal/ManageTag/ManageFolderModal';
import ManageTagModal from 'screens/AdminPortal/ManageTag/ManageTagModal';
import type {
  InterfaceOrganizationTagsWithFolderQuery,
  InterfaceTagFolderChildFoldersQuery,
  InterfaceTagFolderTableRow,
} from 'types/AdminPortal/Tags/interface';

function TagFoldersHierarchy(): JSX.Element {
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

  const { data: organizationTagsData } =
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
        folderRefetch();
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
        folderRefetch();
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

  const additionalActionButtons = (
    <div className={styles.actionButtonsRow}>
      <Button
        variant="outline-secondary"
        onClick={showCreateFolderModal}
        data-testid="addFolderBtn"
        className={`${styles.createButton} ${styles.buttonNoWrap}`}
      >
        <i className={'fa fa-plus me-2'} />
        {t('addChildTag')}
      </Button>
      <Button
        variant="outline-secondary"
        onClick={showCreateTagModal}
        data-testid="addTagBtn"
        className={`${styles.createButton} ${styles.buttonNoWrap}`}
      >
        <i className={'fa fa-plus me-2'} />
        {t('createTagInFolder')}
      </Button>
    </div>
  );

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

  const columns: IColumnDef<InterfaceTagFolderTableRow>[] = [
    {
      id: 'sl_no',
      header: '#',
      accessor: 'id',
      render: (_value, row) => <div>{rowIndexMap.get(row.id) ?? 0}</div>,
      meta: {
        sortable: false,
      },
    },
    {
      id: 'name',
      header: t('tagName'),
      accessor: 'name',
      render: (value, row) => {
        const isFolder = row.rowType === 'folder';

        if (isFolder) {
          return (
            <Button
              variant="link"
              className={styles.folderNameButton}
              data-testid="tagName"
              onClick={() => redirectToChildFolders(row.id)}
            >
              <i
                className={`fa fa-folder me-1 ${styles.nameIcon}`}
                aria-hidden="true"
              />
              {String(value)}
            </Button>
          );
        }

        return (
          <Button
            variant="link"
            className={styles.folderNameButton}
            data-testid="tagName"
            onClick={() => redirectToManageTag(row.id)}
          >
            <i
              className={`fa fa-tag me-1 ${styles.nameIcon}`}
              aria-hidden="true"
            />
            {String(value)}
          </Button>
        );
      },
      meta: { sortable: false },
    },
    {
      id: 'type',
      header: t('type'),
      accessor: 'rowType',
      render: (_value, row) => {
        return (
          <span
            className={
              row.rowType === 'folder' ? styles.folderBadge : styles.tagBadge
            }
          >
            {row.rowType === 'folder' ? t('folderType') : t('tagType')}
          </span>
        );
      },
      meta: { sortable: false },
    },
    {
      id: 'assignees',
      header: t('total'),
      accessor: 'name',
      render: (_value, row) => {
        if (row.rowType === 'folder') {
          return (
            <span className={styles.assigneesMeta}>
              {t('child', { count: row.childFoldersCount ?? 0 })} ·{' '}
              {t('tags', { count: row.tagsCount ?? 0 })}
            </span>
          );
        }

        return <span className={styles.assigneesMeta}>-</span>;
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'createdBy',
      header: t('createdBy'),
      accessor: 'createdBy',
      render: (value) => (
        <span className={styles.assigneesMeta}>{String(value ?? '--')}</span>
      ),
      meta: {
        sortable: false,
      },
    },
    {
      id: 'createdAt',
      header: t('createdAt'),
      accessor: 'createdAt',
      render: (value) => (
        <span className={styles.assigneesMeta}>
          {formatCreatedAt((value as string) ?? null)}
        </span>
      ),
      meta: {
        sortable: false,
      },
    },
    {
      id: 'actions',
      header: tCommon('actions'),
      accessor: 'id',
      render: (_value, row) => {
        const isFolder = row.rowType === 'folder';

        return (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() =>
              isFolder ? showManageFolderModal(row) : showManageTagModal(row)
            }
            className={styles.editButton}
          >
            {tCommon('manage')}
          </Button>
        );
      },
      meta: { sortable: false },
    },
  ];

  if (folderError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className="fw-bold text-danger text-center">
            {tCommon('errorOccured')}
          </h6>
        </div>
      </div>
    );
  }

  return (
    <>
      <Row>
        <div>
          {folderBreadcrumbs.length > 0 && (
            <div className={styles.pageBreadcrumb}>
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
                      data-testid="redirectToSubTags"
                    >
                      {tag.name}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <Toolbar
            search={{
              placeholder: tCommon('searchByName'),
              value: folderSearchName,
              onSearch: (value) => setFolderSearchName(value.trim()),
              onChange: (value) => setFolderSearchName(value.trim()),
              inputTestId: 'searchByName',
              buttonTestId: 'searchBtn',
              ariaDescription: tCommon('searchByName'),
            }}
            rootClassName={styles.btnsContainer}
            actions={additionalActionButtons}
          />

          <div className="mb-2 ">
            <div
              data-testid="subTagsScrollableDiv"
              className={styles.subTagsScrollableDiv}
            >
              {!folderLoading && unifiedRows.length === 0 ? (
                <EmptyState
                  icon="Tag"
                  message={t('noTagsFound')}
                  dataTestId="tags-empty-state"
                />
              ) : (
                <DataTable<InterfaceTagFolderTableRow>
                  data={unifiedRows}
                  columns={columns}
                  loading={folderLoading}
                  rowKey="id"
                  paginationMode="client"
                  pageSize={PAGE_SIZE}
                  tableClassName={styles.listTable}
                />
              )}
            </div>
          </div>
        </div>
      </Row>

      <CreateModal
        open={createFolderModal.isOpen}
        onClose={hideCreateFolderModal}
        title={t('tagDetails')}
        onSubmit={createFolderInFolder}
        loading={createFolderLoading}
        submitDisabled={Boolean(folderNameError)}
        data-testid="createFolderInFolderModal"
        className={`${styles.folderCreateModal} ${styles.createMode}`}
      >
        <div className={styles.fieldRow}>
          <FormTextField
            name="folderName"
            label={t('tagName')}
            placeholder={t('tagNamePlaceholder')}
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
        className={`${styles.folderCreateModal} ${styles.createMode}`}
      >
        <div className={styles.fieldRow}>
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

      <ManageFolderModal
        open={manageFolderModal.isOpen}
        folder={managedFolder}
        onClose={hideManageFolderModal}
        onRefetch={folderRefetch}
        onViewFolder={redirectToChildFolders}
        modalTestId="manageChildFolderModal"
        inputTestId="manageFolderNameInput"
        deleteModalTestId="delete-child-tag-folder-modal"
      />

      <ManageTagModal
        open={manageTagModal.isOpen}
        tag={managedTag}
        onClose={hideManageTagModal}
        onRefetch={folderRefetch}
        onViewTag={redirectToManageTag}
        modalTestId="manageTagModal"
        inputTestId="manageTagNameInput"
        deleteModalTestId="delete-tag-modal"
      />
    </>
  );
}

export default TagFoldersHierarchy;
