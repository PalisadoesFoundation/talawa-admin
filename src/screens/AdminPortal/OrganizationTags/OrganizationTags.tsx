/**
 * OrganizationTags Component
 *
 * This component is responsible for managing and displaying organization tags.
 * It provides functionalities such as searching, sorting, creating, and managing tags.
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
import { useNavigate, useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import type { InterfaceTagDataPG } from 'utils/interfaces';
import styles from './OrganizationTags.module.css';
import type {
  InterfaceOrganizationTagsQueryPG,
  SortedByType,
} from 'utils/organizationTagsUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ORGANIZATION_USER_TAGS_LIST_PG } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';

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

  const [tagSearchName, setTagSearchName] = useState('');
  const [tagSortOrder, setTagSortOrder] = useState<SortedByType>('DESCENDING');

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [tagName, setTagName] = useState<string>('');

  const {
    data: orgUserTagsData,
    error: orgUserTagsError,
    refetch: orgUserTagsRefetch,
    fetchMore: fetchMoreTags,
    loading: orgUserTagsLoading,
  }: InterfaceOrganizationTagsQueryPG = useQuery(
    ORGANIZATION_USER_TAGS_LIST_PG,
    {
      variables: {
        input: { id: orgId },
        first: PAGE_SIZE,
        where: { name: { starts_with: tagSearchName } },
        sortedBy: { id: tagSortOrder },
      },
    },
  );

  useEffect(() => {
    orgUserTagsRefetch();
  }, []);

  const loadMoreTags = (): void => {
    if (!orgUserTagsData?.organization?.tags?.pageInfo?.hasNextPage) return;
    fetchMoreTags({
      variables: {
        after: orgUserTagsData?.organization?.tags?.pageInfo?.endCursor,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        return {
          organization: {
            ...fetchMoreResult.organization,
            tags: {
              ...fetchMoreResult.organization.tags,
              edges: [
                ...(prevResult.organization?.tags?.edges || []),
                ...(fetchMoreResult.organization?.tags?.edges || []),
              ],
            },
          },
        };
      },
    });
  };

  const [create] = useMutation(CREATE_USER_TAG);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTag = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!tagName.trim()) {
      NotificationToast.error(t('enterTagName'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await create({
        variables: { name: tagName, organizationId: orgId },
      });
      if (data) {
        NotificationToast.success(t('tagCreationSuccess'));
        orgUserTagsRefetch();
        setTagName('');
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

  const userTagsList =
    orgUserTagsData?.organization?.tags?.edges?.map(
      (edge: { node: InterfaceTagDataPG }) => edge.node,
    ) || [];

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/subTags/${tagId}`);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            {t('tags')}{' '}
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--gray-400)', marginLeft: '8px' }}>
              {userTagsList?.length ?? 0}
            </span>
          </h1>
          <p className="page-subtitle">{t('tagName')}</p>
        </div>
        <div className="page-header-actions">
          <button
            onClick={() => {
              setTagName('');
              showCreateTagModal();
            }}
            data-testid="createTagBtn"
            className="btn btn-primary"
            aria-label={t('createTag')}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {t('createTag')}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar" data-testid="organizationTags-header">
        <div className="search-bar">
          <svg aria-hidden="true" className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder={tCommon('searchByName')}
            aria-label={tCommon('searchByName')}
            value={tagSearchName}
            onChange={(e) => setTagSearchName(e.target.value.trim())}
            data-testid="searchByName"
          />
        </div>
      </div>

      {orgUserTagsError ? (
        showErrorMessage(orgUserTagsError.message)
      ) : orgUserTagsLoading ? (
        <LoadingState isLoading={true} variant="spinner" size="lg" data-testid="loadingState">
          {null}
        </LoadingState>
      ) : (
        <>
          <div className="card">
            <div
              id="orgUserTagsScrollableDiv"
              data-testid="orgUserTagsScrollableDiv"
              className={styles.orgUserTagsScrollableDiv}
            >
              <InfiniteScroll
                dataLength={userTagsList?.length ?? 0}
                next={loadMoreTags}
                hasMore={
                  orgUserTagsData?.organization?.tags?.pageInfo
                    ?.hasNextPage ?? false
                }
                loader={
                  <LoadingState
                    isLoading={true}
                    variant="inline"
                    size="sm"
                    data-testid="infiniteScrollLoader"
                  >
                    {null}
                  </LoadingState>
                }
                scrollableTarget="orgUserTagsScrollableDiv"
              >
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">{t('tagName')}</th>
                        <th scope="col">{t('totalAssignedUsers')}</th>
                        <th scope="col">{t('totalSubTags')}</th>
                        <th scope="col">{tCommon('created')}</th>
                        <th scope="col">{tCommon('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTagsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}>
                            {t('noTagsFound')}
                          </td>
                        </tr>
                      ) : (
                        userTagsList.map((tag: InterfaceTagDataPG) => (
                          <tr key={tag.id}>
                            <td className="cell-primary">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  redirectToManageTag(tag.id);
                                }}
                                style={{ color: 'var(--green-600)' }}
                                data-testid="tagName"
                              >
                                {tag.name}
                              </a>
                            </td>
                            <td>{tag.usersAssignedTo?.totalCount ?? 0}</td>
                            <td>{tag.childTags?.totalCount ?? 0}</td>
                            <td>{tag.createdAt ? new Date(tag.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : ''}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => redirectToManageTag(tag.id)}
                                  data-testid="manageTagBtn"
                                >
                                  {tCommon('edit')}
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => redirectToSubTags(tag.id)}
                                  data-testid="subTagsBtn"
                                >
                                  {tCommon('delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </>
      )}

      <CreateModal
        open={createTagModalIsOpen}
        title={t('tagDetails')}
        onClose={hideCreateTagModal}
        onSubmit={createTag}
        loading={isSubmitting}
        submitDisabled={!tagName.trim()}
        data-testid="createTagModal"
      >
        <FormTextField
          name="tagName"
          label={t('tagName')}
          placeholder={t('tagNamePlaceholder')}
          value={tagName}
          onChange={setTagName}
          required
          autoComplete="off"
          data-testid="tagNameInput"
          className={styles.inputField}
        />
      </CreateModal>
    </>
  );
}

export default OrganizationTags;
