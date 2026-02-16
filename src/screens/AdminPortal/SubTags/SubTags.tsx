/**
 * SubTags Component
 *
 * This component is responsible for managing and displaying the sub-tags
 * of a parent tag within an organization. It provides functionality to
 * view, search, sort, and add sub-tags, as well as navigate between tags
 * and their sub-tags.
 *
 * @returns The rendered SubTags component.
 */
import { useMutation, useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import IconComponent from 'components/IconComponent/IconComponent';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useNavigate, useParams, Link } from 'react-router';
import type { FormEvent } from 'react';
import React, { useState } from 'react';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import Button from 'shared-components/Button';
import {
  CreateModal,
  useModalState,
} from 'shared-components/CRUDModalTemplate';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type { InterfaceQueryUserTagChildTags } from 'utils/interfaces';
import styles from './SubTags.module.css';
import { DataGridWrapper } from 'shared-components/DataGridWrapper';
import type {
  InterfaceOrganizationSubTagsQuery,
  SortedByType,
} from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import type {
  GridCellParams,
  GridColDef,
} from 'shared-components/DataGridWrapper';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

function SubTags(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');

  const addSubTagModal = useModalState();

  const { orgId, tagId: parentTagId } = useParams();

  const navigate = useNavigate();

  const [tagName, setTagName] = useState<string>('');
  const [tagNameTouched, setTagNameTouched] = useState(false);

  const [tagSearchName, setTagSearchName] = useState('');
  const [tagSortOrder, setTagSortOrder] = useState<SortedByType>('DESCENDING');

  const showAddSubTagModal = (): void => {
    addSubTagModal.open();
  };

  const hideAddSubTagModal = (): void => {
    addSubTagModal.close();
    setTagName('');
    setTagNameTouched(false);
  };

  const {
    data: subTagsData,
    error: subTagsError,
    loading: subTagsLoading,
    refetch: subTagsRefetch,
    fetchMore: fetchMoreSubTags,
  }: InterfaceOrganizationSubTagsQuery = useQuery(USER_TAG_SUB_TAGS, {
    variables: {
      id: parentTagId,
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
      where: { name: { starts_with: tagSearchName } },
      sortedBy: { id: tagSortOrder },
    },
  });

  const loadMoreSubTags = (): void => {
    fetchMoreSubTags({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: subTagsData?.getChildTags.childTags.pageInfo.endCursor,
      },
      updateQuery: (
        prevResult: { getChildTags: InterfaceQueryUserTagChildTags },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult?: { getChildTags: InterfaceQueryUserTagChildTags };
        },
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          getChildTags: {
            ...fetchMoreResult.getChildTags,
            childTags: {
              ...fetchMoreResult.getChildTags.childTags,
              edges: [
                ...prevResult.getChildTags.childTags.edges,
                ...fetchMoreResult.getChildTags.childTags.edges,
              ],
            },
          },
        };
      },
    });
  };

  const [create, { loading: createUserTagLoading }] =
    useMutation(CREATE_USER_TAG);

  const addSubTag = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await create({
        variables: {
          name: tagName,
          organizationId: orgId,
          folderId: parentTagId,
        },
      });

      if (data) {
        NotificationToast.success(t('tagCreationSuccess') as string);
        subTagsRefetch();
        setTagName('');
        addSubTagModal.close();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  if (subTagsError) {
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

  const subTagsList =
    subTagsData?.getChildTags.childTags.edges.map((edge) => edge.node) ?? [];

  const parentTagName = subTagsData?.getChildTags.name;

  // get the ancestorTags array and push the current tag in it
  // used for the tag breadcrumbs
  const orgUserTagAncestors = [
    ...(subTagsData?.getChildTags.ancestorTags ?? []),
    { _id: parentTagId, name: parentTagName },
  ];

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/subTags/${tagId}`);
  };

  const sortDropdownConfig = {
    id: 'subtags-sort-dropdown',
    label: tCommon('sort'),
    type: 'sort' as const,
    options: [
      { label: t('Latest'), value: 'DESCENDING' },
      { label: t('Oldest'), value: 'ASCENDING' },
    ],
    selectedOption: tagSortOrder,
    onOptionChange: (value: string | number) =>
      setTagSortOrder(value as SortedByType),
    dataTestIdPrefix: 'sortTags',
  };

  const additionalActionButtons = (
    <>
      <Button
        onClick={() => redirectToManageTag(parentTagId as string)}
        data-testid="manageCurrentTagBtn"
        className={`${styles.createButton} mb-3`}
      >
        {`${t('manageTag')} ${subTagsData?.getChildTags.name}`}
      </Button>

      <Button
        variant="success"
        onClick={showAddSubTagModal}
        data-testid="addSubTagBtn"
        className={`${styles.createButton} mb-3`}
      >
        <i className={'fa fa-plus me-2'} />
        {t('addChildTag')}
      </Button>
    </>
  );

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.id}</div>;
      },
    },
    {
      field: 'tagName',
      headerName: t('tagName'),
      flex: 1,
      minWidth: 100,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className={styles.subTagsLink}
            data-testid="tagName"
            onClick={() => redirectToSubTags(params.row._id as string)}
          >
            {params.row.name}

            <i className={'ms-2 fa fa-caret-right'} />
          </div>
        );
      },
    },
    {
      field: 'totalSubTags',
      headerName: t('totalSubTags'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Link
            className="text-secondary"
            to={`/admin/orgtags/${orgId}/subTags/${params.row._id}`}
            aria-label={t('viewSubTags', {
              count: params.row.childTags.totalCount,
            })}
          >
            {params.row.childTags.totalCount}
          </Link>
        );
      },
    },
    {
      field: 'totalAssignedUsers',
      headerName: t('totalAssignedUsers'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Link
            className="text-secondary"
            to={`/admin/orgtags/${orgId}/manageTag/${params.row._id}`}
          >
            {params.row.usersAssignedTo.totalCount}
          </Link>
        );
      },
    },
    {
      field: 'actions',
      headerName: tCommon('actions'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            size="sm"
            onClick={() => redirectToManageTag(params.row._id)}
            data-testid="manageTagBtn"
            className={styles.editButton}
          >
            {t('manageTag')}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <div>
          <SearchFilterBar
            searchPlaceholder={tCommon('searchByName')}
            searchValue={tagSearchName}
            onSearchChange={(value) => setTagSearchName(value.trim())}
            searchInputTestId="searchByName"
            searchButtonTestId="searchBtn"
            hasDropdowns={true}
            dropdowns={[sortDropdownConfig]}
            additionalButtons={additionalActionButtons}
          />

          <LoadingState
            isLoading={subTagsLoading}
            variant="skeleton"
            size="lg"
            data-testid="subTagsLoadingState"
          >
            <div className="mb-2 ">
              <div className="bg-white light border rounded-top mb-0 py-2 d-flex align-items-center">
                <div className="ms-3 my-1">
                  <IconComponent name="Tag" />
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/admin/orgtags/${orgId}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/admin/orgtags/${orgId}`);
                    } else if (e.key === ' ') {
                      e.preventDefault();
                      navigate(`/admin/orgtags/${orgId}`);
                    }
                  }}
                  className={`fs-6 ms-3 my-1 ${styles.tagsBreadCrumbs}`}
                  data-testid="allTagsBtn"
                  data-text={t('tags')}
                >
                  {t('tags')}
                  <i className={'mx-2 fa fa-caret-right'} aria-hidden="true" />
                </button>

                {orgUserTagAncestors?.map((tag, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`ms-2  ${tag._id === parentTagId ? `fs-4 fw-semibold text-secondary` : `${styles.tagsBreadCrumbs} fs-6`}`}
                    onClick={() => redirectToSubTags(tag._id as string)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        redirectToSubTags(tag._id as string);
                      } else if (e.key === ' ') {
                        e.preventDefault();
                        redirectToSubTags(tag._id as string);
                      }
                    }}
                    data-testid="redirectToSubTags"
                    data-text={tag.name}
                  >
                    {tag.name}

                    {orgUserTagAncestors.length - 1 !== index && (
                      <i
                        className={'mx-2 fa fa-caret-right'}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div
                id="subTagsScrollableDiv"
                data-testid="subTagsScrollableDiv"
                className={styles.subTagsScrollableDiv}
              >
                <InfiniteScroll
                  dataLength={subTagsList?.length ?? 0}
                  next={loadMoreSubTags}
                  hasMore={
                    subTagsData?.getChildTags.childTags.pageInfo.hasNextPage ??
                    false
                  }
                  loader={
                    <LoadingState
                      isLoading={true}
                      variant="inline"
                      size="sm"
                      data-testid="infiniteScrollLoader"
                    >
                      <></>
                    </LoadingState>
                  }
                  scrollableTarget="subTagsScrollableDiv"
                >
                  <DataGridWrapper
                    rows={subTagsList?.map((subTag, index) => ({
                      id: index + 1,
                      ...subTag,
                    }))}
                    columns={columns}
                    emptyStateProps={{
                      message: t('noTagsFound'),
                    }}
                  />
                </InfiniteScroll>
              </div>
            </div>
          </LoadingState>
        </div>
      </Row>

      {/* Create Tag Modal */}
      <CreateModal
        open={addSubTagModal.isOpen}
        onClose={hideAddSubTagModal}
        title={t('tagDetails')}
        onSubmit={addSubTag}
        loading={createUserTagLoading}
        submitDisabled={!tagName}
        data-testid="addSubTagModal"
      >
        <FormTextField
          name="tagName"
          label={t('tagName')}
          placeholder={t('tagNamePlaceholder')}
          value={tagName}
          onChange={(val) => {
            setTagName(val);
            if (!tagNameTouched) setTagNameTouched(true);
          }}
          onBlur={() => setTagNameTouched(true)}
          touched={tagNameTouched}
          error={tagNameTouched && !tagName ? tCommon('required') : undefined}
          required
          data-testid="modalTitle"
          autoComplete="off"
        />
      </CreateModal>
    </>
  );
}

export default SubTags;
