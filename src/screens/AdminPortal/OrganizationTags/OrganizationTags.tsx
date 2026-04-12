/**
 * OrganizationTags Component
 *
 * This component is responsible for managing and displaying organization tags.
 * It provides functionalities such as searching, creating, and managing tags.
 * The component integrates with GraphQL queries and mutations to fetch and update data.
 *
 *
 * @remarks
 * - Utilizes Apollo Client's `useQuery` and `useMutation` hooks for data fetching and mutations.
 * - Uses DataGridWrapper for displaying tags in a tabular format with pagination support.
 * - Includes a modal for creating new tags.
 *
 *
 * @example
 * ```tsx
 * <OrganizationTags />
 * ```
 *
 * @returns  The rendered OrganizationTags component.
 *
 */
import { useMutation, useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useNavigate, useParams, Link } from 'react-router';
import React, { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import Button from 'shared-components/Button';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import styles from './OrganizationTags.module.css';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import { ORGANIZATION_USER_TAGS_LIST_PG } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_TAG_FOLDER } from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_TAGS_WITH_FOLDER } from 'GraphQl/Queries/userTagQueries';
import Toolbar from 'shared-components/Toolbar/Toolbar';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import ManageFolderModal from 'screens/AdminPortal/ManageTag/ManageFolderModal';
import type {
  InterfaceOrganizationTagCountsQuery,
  InterfaceOrganizationTagFoldersQuery,
  InterfaceTagFolderNode,
} from 'types/AdminPortal/Tag/interface';

function OrganizationTags(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');

  const {
    isOpen: createTagModalIsOpen,
    open: showCreateTagModal,
    close: hideCreateTagModal,
  } = useModalState();

  const manageTagFolderModal = useModalState();

  const [folderSearchName, setFolderSearchName] = useState('');

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [folderName, setFolderName] = useState<string>('');
  const [folderNameTouched, setFolderNameTouched] = useState(false);
  const [selectedFolder, setSelectedFolder] =
    useState<InterfaceTagFolderNode | null>(null);

  const folderNameError =
    folderNameTouched && !folderName.trim() ? tCommon('required') : undefined;

  const {
    data: orgTagFoldersData,
    error: orgTagFoldersError,
    refetch: orgTagFoldersRefetch,
    loading: orgTagFoldersLoading,
  } = useQuery<InterfaceOrganizationTagFoldersQuery>(
    ORGANIZATION_USER_TAGS_LIST_PG,
    {
      variables: {
        input: { id: orgId },
        first: PAGE_SIZE,
      },
    },
  );

  const { data: orgTagsData } = useQuery<InterfaceOrganizationTagCountsQuery>(
    ORGANIZATION_TAGS_WITH_FOLDER,
    {
      variables: {
        id: orgId,
        first: 32,
      },
      skip: !orgId,
    },
  );

  const [createTagFolder] = useMutation(CREATE_TAG_FOLDER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTagFolder = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!folderName.trim()) {
      NotificationToast.error(t('enterTagName'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await createTagFolder({
        variables: { name: folderName, organizationId: orgId },
      });

      if (data) {
        NotificationToast.success(t('tagCreationSuccess'));
        orgTagFoldersRefetch();
        setFolderName('');
        hideCreateTagModal();
      } else {
        NotificationToast.error(t('tagCreationFailed'));
      }
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showErrorMessage = (message: string): JSX.Element => {
    return (
      <div className={styles.errorContainer + ' rounded-4 my-3'}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded fontSize="large" className={styles.errorIcon} />
          <h6 style={{ textAlign: "center" }}>
            {t('errorLoadingTagsData')}
            <br />
            {message}
          </h6>
        </div>
      </div>
    );
  };

  const tagFolderEdges =
    orgTagFoldersData?.organization?.tagFolders?.edges ?? [];
  const tagFoldersList = tagFolderEdges.map((edge) => edge.node);

  const filteredTagFolders = useMemo(() => {
    const normalizedSearchValue = folderSearchName.trim().toLowerCase();
    return tagFoldersList.filter((folder) =>
      folder.name.toLowerCase().startsWith(normalizedSearchValue),
    );
  }, [tagFoldersList, folderSearchName]);

  const tagCountByFolderId = useMemo(() => {
    const counts: Record<string, number> = {};
    const organizationTags =
      orgTagsData?.organization?.tags?.edges?.map((edge) => edge.node) ?? [];

    for (const tag of organizationTags) {
      const folderId = tag.folder?.id;
      if (!folderId) continue;
      counts[folderId] = (counts[folderId] ?? 0) + 1;
    }

    return counts;
  }, [orgTagsData]);

  const redirectToChildFolders = (folderId: string): void => {
    navigate(`/admin/orgtags/${orgId}/tags/${folderId}`);
  };

  const showManageFolderModal = (folder: InterfaceTagFolderNode): void => {
    setSelectedFolder(folder);
    manageTagFolderModal.open();
  };

  const hideManageFolderModal = (): void => {
    manageTagFolderModal.close();
    setSelectedFolder(null);
  };

  const renderCountLink = (
    folderId: string,
    buildPath: (id: string) => string,
    count: number | undefined,
  ) => (
    <Link className="text-secondary" to={buildPath(folderId)}>
      {count ?? 0}
    </Link>
  );

  const formatCreatedAt = (value?: string | null): string => {
    if (!value) return '--';

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return '--';

    return parsedDate.toLocaleDateString();
  };

  const rowIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredTagFolders.forEach((folder, index) => {
      map.set(folder.id, index + 1);
    });
    return map;
  }, [filteredTagFolders]);

  const columns: IColumnDef<InterfaceTagFolderNode>[] = [
    {
      id: 'sl_no',
      header: tCommon('sl_no'),
      accessor: 'id',
      render: (_value, row) => (
        <span className={styles.tableItemIndex}>
          {(rowIndexMap.get(row.id) ?? 0).toString()}.
        </span>
      ),
      meta: { sortable: false },
    },
    {
      id: 'folderName',
      header: t('tagName'),
      accessor: 'name',
      render: (value, row) => {
        return (
          <Button
            variant="link"
            className={styles.folderNameButton}
            data-testid="tagName"
            onClick={() => redirectToChildFolders(row.id)}
            aria-label={tCommon('viewSubTagsOf', {
              tagName: row.name,
            })}
          >
            <i
              className={`fa fa-folder me-1 ${styles.nameIcon}`}
              aria-hidden="true"
            />
            {String(value)}
          </Button>
        );
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'totalSubFolders',
      header: t('totalSubTags'),
      accessor: 'id',
      render: (_value, row) => {
        return renderCountLink(
          row.id,
          (id) => `/admin/orgtags/${orgId}/tags/${id}`,
          row.childFolders?.edges?.length,
        );
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'totalTags',
      header: t('totalAssignedUsers'),
      accessor: 'id',
      render: (_value, row) => {
        const fallbackCount = tagCountByFolderId[row.id];
        const directCount = row.tags?.edges?.length ?? 0;
        return <span>{fallbackCount ?? directCount}</span>;
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'createdBy',
      header: t('createdBy'),
      accessor: 'creator',
      render: (_value, row) => <span>{row.creator?.name ?? '--'}</span>,
      meta: {
        sortable: false,
      },
    },
    {
      id: 'createdAt',
      header: t('createdAt'),
      accessor: 'createdAt',
      render: (value) => (
        <span>{formatCreatedAt((value as string) ?? null)}</span>
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
        return (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => showManageFolderModal(row)}
            data-testid="manageTagBtn"
            className={styles.editButton}
            aria-label={`${tCommon('manage')} ${row.name ?? ''}`.trim()}
          >
            {tCommon('manage')}
          </Button>
        );
      },
      meta: { sortable: false },
    },
  ];

  return (
    <>
      <Row>
        <div>
          <div data-testid="organizationTags-header">
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
              actions={
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setFolderName('');
                    setFolderNameTouched(false);
                    showCreateTagModal();
                  }}
                  data-testid="createTagBtn"
                  className={styles.createButton}
                  aria-label={t('createTag')}
                >
                  <i className="fa fa-plus me-2" />
                  {t('createTag')}
                </Button>
              }
            />
          </div>

          {orgTagFoldersError ? (
            showErrorMessage(orgTagFoldersError.message)
          ) : (
            <div className="mb-4">
              <div data-testid="orgUserTagsScrollableDiv">
                {!orgTagFoldersLoading && filteredTagFolders.length === 0 ? (
                  <EmptyState
                    icon="Tag"
                    message={t('noTagsFound')}
                    dataTestId="organization-tags-empty-state"
                  />
                ) : (
                  <DataTable<InterfaceTagFolderNode>
                    data={filteredTagFolders}
                    columns={columns}
                    loading={orgTagFoldersLoading}
                    rowKey="id"
                    paginationMode="client"
                    pageSize={PAGE_SIZE}
                    tableClassName={styles.listTable}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Row>

      <CreateModal
        open={createTagModalIsOpen}
        title={t('tagDetails')}
        onClose={() => {
          hideCreateTagModal();
          setFolderNameTouched(false);
        }}
        onSubmit={handleCreateTagFolder}
        loading={isSubmitting}
        submitDisabled={Boolean(folderNameError)}
        data-testid="createTagModal"
        className={`${styles.folderCreateModal} ${styles.createMode}`}
      >
        <div className={styles.fieldRow}>
          <FormTextField
            name="folderName"
            label={t('tagName')}
            placeholder={t('tagNamePlaceholder')}
            value={folderName}
            onChange={(value) => {
              setFolderName(value);
              if (!folderNameTouched) {
                setFolderNameTouched(true);
              }
            }}
            onBlur={() => setFolderNameTouched(true)}
            touched={folderNameTouched}
            error={folderNameError}
            required
            autoComplete="off"
            data-testid="tagNameInput"
          />
        </div>
      </CreateModal>

      <ManageFolderModal
        open={manageTagFolderModal.isOpen}
        folder={selectedFolder}
        onClose={hideManageFolderModal}
        onRefetch={orgTagFoldersRefetch}
        onViewFolder={redirectToChildFolders}
        modalTestId="manageTagFolderModal"
        inputTestId="editTagFolderNameInput"
        deleteModalTestId="delete-tag-folder-modal"
      />
    </>
  );
}

export default OrganizationTags;
