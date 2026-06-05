/**
 * OrganizationTags Component
 *
 * This component is the root dashboard for managing and displaying organization tags.
 * It provides functionalities such as searching, creating, and managing root-level tags and folders.
 * The component integrates with GraphQL queries and mutations to fetch and update data.
 *
 * @remarks
 * - Utilizes Apollo Client's `useQuery` and `useMutation` hooks for data fetching and mutations.
 * - Uses native HTML tables with custom `TableLoader` for displaying tags in a tabular format.
 * - Includes modals for creating and managing new tags and folders.
 *
 * @example
 * ```tsx
 * <OrganizationTags />
 * ```
 *
 * @returns The rendered OrganizationTags component.
 */
import { useMutation, useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useNavigate, useParams, Link } from 'react-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import styles from './RootView.module.css';
import { ORGANIZATION_USER_TAGS_LIST_PG } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_TAG_FOLDER } from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_TAGS_WITH_FOLDER } from 'GraphQl/Queries/userTagQueries';
import TableLoader from 'shared-components/TableLoader/TableLoader';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import EditFolderModal from 'components/AdminPortal/Tags/Modals/EditFolderModal/EditFolderModal';
import type {
  InterfaceOrganizationTagCountsQuery,
  InterfaceOrganizationTagFoldersQuery,
  InterfaceTagFolderNode,
} from 'types/AdminPortal/Tag/interface';

function RootView(): JSX.Element {
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
      <div
        className={styles.errorContainer}
        style={{ borderRadius: 'var(--space-5)', margin: '16px 0' }}
      >
        <div className={styles.errorMessage}>
          <WarningAmberRounded fontSize="large" className={styles.errorIcon} />
          <h6 style={{ textAlign: 'center' }}>
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

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div
            className={styles.pageBreadcrumb}
            data-testid="organizationTagsRootBreadcrumb"
            style={{ marginBottom: 'var(--space-3)' }}
          >
            <span className={styles.breadcrumbCurrent}>{t('tags')}</span>
            <span className={styles.breadcrumbDivider}>/</span>
          </div>
          <h1 className="page-title">{t('tags')}</h1>
          <p className="page-subtitle">
            {tCommon('manage')} {t('tags')}
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setFolderName('');
              setFolderNameTouched(false);
              showCreateTagModal();
            }}
            data-testid="createTagBtn"
            aria-label={t('createTag')}
          >
            + {t('createTag')}
          </button>
        </div>
      </div>

      <div
        className="toolbar"
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
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
            padding: 'var(--space-3) var(--space-4)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        />
      </div>

      {orgTagFoldersError ? (
        showErrorMessage(orgTagFoldersError.message)
      ) : (
        <div>
          {orgTagFoldersLoading ? (
            <TableLoader
              headerTitles={[
                tCommon('sl_no'),
                t('tagName'),
                t('totalChildFolders'),
                t('totalAssignedUsers'),
                t('createdBy'),
                t('createdAt'),
                tCommon('actions'),
              ]}
              noOfRows={PAGE_SIZE}
            />
          ) : filteredTagFolders.length === 0 ? (
            <div className="card">
              <EmptyState
                icon="Tag"
                message={t('noTagsFound')}
                dataTestId="organization-tags-empty-state"
              />
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table" aria-label={t('tags')}>
                <thead>
                  <tr>
                    <th scope="col">{tCommon('sl_no')}</th>
                    <th scope="col">{t('tagName')}</th>
                    <th scope="col">{t('totalChildFolders')}</th>
                    <th scope="col">{t('totalAssignedUsers')}</th>
                    <th scope="col">{t('createdBy')}</th>
                    <th scope="col">{t('createdAt')}</th>
                    <th scope="col">{tCommon('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTagFolders.map((row) => {
                    const fallbackCount = tagCountByFolderId[row.id];
                    const directCount = row.tags?.edges?.length ?? 0;
                    return (
                      <tr key={row.id}>
                        <td>
                          <span className={styles.tableItemIndex}>
                            {(rowIndexMap.get(row.id) ?? 0).toString()}.
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-link ${styles.folderNameButton}`}
                            style={{
                              padding: 0,
                              textDecoration: 'none',
                              color: 'var(--primary-color, #10b981)',
                            }}
                            data-testid="tagName"
                            onClick={() => redirectToChildFolders(row.id)}
                            aria-label={tCommon('viewChildFoldersOf', {
                              tagName: row.name,
                            })}
                          >
                            <i
                              className={`fa fa-folder ${styles.nameIcon}`}
                              style={{ marginRight: 'var(--space-2)' }}
                              aria-hidden="true"
                            />
                            {row.name}
                          </button>
                        </td>
                        <td>
                          {renderCountLink(
                            row.id,
                            (id) => `/admin/orgtags/${orgId}/tags/${id}`,
                            row.childFolders?.edges?.length,
                          )}
                        </td>
                        <td>
                          <span>{fallbackCount ?? directCount}</span>
                        </td>
                        <td>
                          <span>{row.creator?.name ?? '--'}</span>
                        </td>
                        <td>
                          <span>{formatCreatedAt(row.createdAt ?? null)}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => showManageFolderModal(row)}
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

      <EditFolderModal
        open={manageTagFolderModal.isOpen}
        folder={selectedFolder}
        onClose={hideManageFolderModal}
        onRefetch={orgTagFoldersRefetch}
        modalTestId="manageTagFolderModal"
        inputTestId="editTagFolderNameInput"
        deleteModalTestId="delete-tag-folder-modal"
      />
    </div>
  );
}

export default RootView;
