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
import { WarningAmberRounded } from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import IconComponent from 'components/IconComponent/IconComponent';
import Button from 'shared-components/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import type { InterfaceTagDataPG } from 'utils/interfaces';
import styles from './OrganizationTags.module.css';
import {
  DataGridWrapper,
  GridColDef,
  type GridCellParams,
} from 'shared-components/DataGridWrapper';
import type {
  InterfaceOrganizationTagsQueryPG,
  SortedByType,
} from 'utils/organizationTagsUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ORGANIZATION_USER_TAGS_LIST_PG } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';

function OrganizationTags(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');

  const [createTagModalIsOpen, setCreateTagModalIsOpen] = useState(false);

  const [tagSearchName, setTagSearchName] = useState('');
  const [tagSortOrder, setTagSortOrder] = useState<SortedByType>('DESCENDING');

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [tagName, setTagName] = useState<string>('');

  const showCreateTagModal = (): void => {
    setTagName('');
    setCreateTagModalIsOpen(true);
  };

  const hideCreateTagModal = (): void => {
    setCreateTagModalIsOpen(false);
  };

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

  const [create, { loading: createTagLoading }] = useMutation(CREATE_USER_TAG);

  const createTag = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!tagName.trim()) {
      NotificationToast.error(t('enterTagName'));
      return;
    }

    try {
      const { data } = await create({
        variables: { name: tagName, organizationId: orgId },
      });
      if (data) {
        NotificationToast.success(t('tagCreationSuccess'));
        orgUserTagsRefetch();
        setTagName('');
        setCreateTagModalIsOpen(false);
      } else {
        NotificationToast.error(t('tagCreationFailed'));
      }
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };

  const showErrorMessage = (message: string): JSX.Element => {
    return (
      <div className={styles.errorContainer + ' bg-white rounded-4 my-3'}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded fontSize="large" className={styles.errorIcon} />
          <h6 className="fw-bold text-danger text-center">
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

  const renderCountLink = (
    params: GridCellParams,
    buildPath: (id: string) => string,
    count: number | undefined,
  ) => (
    <Link className="text-secondary" to={buildPath(params.row.id)}>
      {count ?? 0}
    </Link>
  );

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: tCommon('sl_no'),
      flex: 0.5,
      minWidth: 60,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <span className={styles.tableItemIndex}>
          {params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1}.
        </span>
      ),
    },
    {
      field: 'name',
      headerName: t('tagName'),
      flex: 2,
      minWidth: 150,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex">
            {params.row.parentTag &&
              params.row.ancestorTags?.map((tag: InterfaceTagDataPG) => (
                <div
                  key={tag.id}
                  className={styles.tagsBreadCrumbs}
                  data-testid="ancestorTagsBreadCrumbs"
                  data-text={tag.name}
                >
                  {tag.name}
                  <i className={'mx-2 fa fa-caret-right'} />
                </div>
              ))}

            <div
              className={styles.subTagsLink}
              data-testid="tagName"
              onClick={() => redirectToSubTags(params.row.id)}
            >
              {params.row.name}
              <i className={'ms-2 fa fa-caret-right'} />
            </div>
          </div>
        );
      },
    },
    {
      field: 'totalSubTags',
      headerName: t('totalSubTags'),
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return renderCountLink(
          params,
          (id) => `/admin/orgtags/${orgId}/subTags/${id}`,
          params.row.childTags?.totalCount,
        );
      },
    },
    {
      field: 'totalAssignedUsers',
      headerName: t('totalAssignedUsers'),
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return renderCountLink(
          params,
          (id) => `/admin/orgtags/${orgId}/manageTag/${id}`,
          params.row.usersAssignedTo?.totalCount,
        );
      },
    },
    {
      field: 'actions',
      headerName: tCommon('actions'),
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => redirectToManageTag(params.row.id)}
            data-testid="manageTagBtn"
            className={styles.editButton}
            aria-label={`${t('manageTag')} ${params.row.name ?? ''}`.trim()}
          >
            {t('manageTag')}
          </Button>
        );
      },
    },
  ];

  const handleSortChange = (value: string): void => {
    setTagSortOrder(value === 'latest' ? 'DESCENDING' : 'ASCENDING');
  };

  return (
    <>
      <Row>
        <div>
          <div
            className={styles.btnsContainer}
            data-testid="organizationTags-header"
          >
            <SearchFilterBar
              hasDropdowns={true}
              searchPlaceholder={tCommon('searchByName')}
              searchValue={tagSearchName}
              onSearchChange={(value) => setTagSearchName(value.trim())}
              searchInputTestId="searchByName"
              searchButtonTestId="searchBtn"
              dropdowns={[
                {
                  id: 'tags-sort',
                  label: t('sortTags'),
                  type: 'sort',
                  options: [
                    { label: tCommon('Latest'), value: 'latest' },
                    { label: tCommon('Oldest'), value: 'oldest' },
                  ],
                  selectedOption:
                    tagSortOrder === 'DESCENDING' ? 'latest' : 'oldest',
                  onOptionChange: (value) => handleSortChange(value.toString()),
                  dataTestIdPrefix: 'sortTags',
                },
              ]}
              additionalButtons={
                <Button
                  onClick={showCreateTagModal}
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

          {orgUserTagsError ? (
            showErrorMessage(orgUserTagsError.message)
          ) : (
            <div className="mb-4">
              <div className="bg-white border light rounded-top mb-0 py-2 d-flex align-items-center">
                <div className="ms-3 my-1">
                  <IconComponent name="Tag" />
                </div>

                <div
                  className={'fs-4 ms-3 my-1 ' + styles.tagsBreadCrumbs}
                  data-text={t('tags')}
                >
                  {t('tags')}
                </div>
              </div>

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
                  <DataGridWrapper<InterfaceTagDataPG>
                    rows={userTagsList}
                    columns={columns}
                    loading={orgUserTagsLoading || createTagLoading}
                    error={undefined}
                    emptyStateProps={{
                      message: t('noTagsFound'),
                    }}
                  />
                </InfiniteScroll>
              </div>
            </div>
          )}
        </div>
      </Row>

      {/* Create Tag Modal */}
      <BaseModal
        show={createTagModalIsOpen}
        onHide={hideCreateTagModal}
        backdrop="static"
        centered
        title={t('tagDetails')}
        headerClassName={styles.tableHeader}
        headerTestId="modalOrganizationHeader"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={(): void => hideCreateTagModal()}
              data-testid="closeCreateTagModal"
              className={styles.removeButton}
              aria-label={tCommon('cancel')}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              form="create-tag-form"
              value="invite"
              data-testid="createTagSubmitBtn"
              className={styles.addButton}
              disabled={createTagLoading}
              aria-label={tCommon('create')}
            >
              {tCommon('create')}
            </Button>
          </>
        }
      >
        <form id="create-tag-form" onSubmit={createTag}>
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
        </form>
      </BaseModal>
    </>
  );
}

export default OrganizationTags;
