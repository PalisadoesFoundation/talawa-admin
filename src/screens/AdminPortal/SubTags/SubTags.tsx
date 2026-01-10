/**
 * SubTags Component
 *
 * This component is responsible for managing and displaying the sub-tags
 * of a parent tag within an organization. It provides functionality to
 * view, search, sort, and add sub-tags, as well as navigate between tags
 * and their sub-tags.
 *
 * Features:
 * - Displays a list of sub-tags in a paginated and scrollable DataGrid.
 * - Allows searching sub-tags by name.
 * - Provides sorting options for sub-tags (e.g., Latest, Oldest).
 * - Enables navigation to manage or view sub-tags and their assigned users.
 * - Includes breadcrumbs for navigating the tag hierarchy.
 * - Allows adding new sub-tags via a modal form.
 *
 * Queries and Mutations:
 * - Fetches sub-tags using the `USER_TAG_SUB_TAGS` GraphQL query.
 * - Adds new sub-tags using the `CREATE_USER_TAG` GraphQL mutation.
 *
 * Props:
 * - None (uses React Router hooks for parameters and navigation).
 *
 * State:
 * - `addSubTagModalIsOpen`: Controls the visibility of the "Add Sub-Tag" modal.
 * - `tagName`: Stores the name of the new sub-tag being created.
 * - `tagSearchName`: Stores the search term for filtering sub-tags.
 * - `tagSortOrder`: Stores the sorting order for sub-tags (ascending/descending).
 *
 * Dependencies:
 * - React, React Router, Apollo Client, Material-UI, React-Bootstrap, NotificationToast.
 *
 * Error Handling:
 * - Displays an error toast notification if the sub-tags query fails
 *   (in external UI mode).
 *
 * Usage:
 * - This component is used in the context of managing organizational tags
 *   and their hierarchy within the Talawa Admin application.
 *
 * @returns The rendered SubTags component.
 */
import { useMutation } from '@apollo/client';
import IconComponent from 'components/IconComponent/IconComponent';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useNavigate, useParams, Link } from 'react-router';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type {
  InterfaceQueryUserTagChildTags,
  InterfaceTagData,
} from 'utils/interfaces';
import styles from './SubTags.module.css';
import { DataGrid } from 'shared-components/DataGridWrapper';
import type { SortedByType } from 'utils/organizationTagsUtils';
import {
  dataGridStyle,
  TAGS_QUERY_DATA_CHUNK_SIZE,
} from 'utils/organizationTagsUtils';
import type {
  GridCellParams,
  GridColDef,
} from 'shared-components/DataGridWrapper';
import { Stack } from '@mui/material';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import CursorPaginationManager from 'components/CursorPaginationManager/CursorPaginationManager';

function SubTags(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');

  const [addSubTagModalIsOpen, setAddSubTagModalIsOpen] = useState(false);

  const { orgId, tagId: parentTagId } = useParams();

  const navigate = useNavigate();

  const [tagName, setTagName] = useState<string>('');

  const [tagSearchName, setTagSearchName] = useState('');
  const [tagSortOrder, setTagSortOrder] = useState<SortedByType>('DESCENDING');
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const showAddSubTagModal = (): void => {
    setAddSubTagModalIsOpen(true);
  };

  const hideAddSubTagModal = (): void => {
    setAddSubTagModalIsOpen(false);
    setTagName('');
  };

  const [create, { loading: createUserTagLoading }] =
    useMutation(CREATE_USER_TAG);

  const addSubTag = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
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
        setRefetchTrigger((prev) => prev + 1);
        setTagName('');
        setAddSubTagModalIsOpen(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/subTags/${tagId}`);
  };

  // Render function for additional action buttons (defined here to use queryData)
  const _renderAdditionalButtons = (
    queryData: { getChildTags: InterfaceQueryUserTagChildTags } | undefined,
  ): JSX.Element => (
    <>
      <Button
        onClick={() => redirectToManageTag(parentTagId as string)}
        data-testid="manageCurrentTagBtn"
        className={`${styles.createButton} mb-3`}
      >
        {`${t('manageTag')} ${queryData?.getChildTags.name ?? ''}`}
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
            to={`/orgtags/${orgId}/subTags/${params.row._id}`}
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
            to={`/orgtags/${orgId}/manageTag/${params.row._id}`}
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

  // Dropdown configuration for sorting
  const sortDropdownConfig = {
    id: 'sort',
    label: t('sort'),
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

  // Additional action buttons configuration
  const additionalActionButtons = [
    <Button
      key="manage-current-tag"
      onClick={() => redirectToManageTag(parentTagId as string)}
      data-testid="manageCurrentTagBtn"
      className={`${styles.createButton} mb-3`}
    >
      {t('manageTag')}
    </Button>,
    <Button
      key="add-sub-tag"
      variant="success"
      onClick={showAddSubTagModal}
      data-testid="addSubTagBtn"
      className={`${styles.createButton} mb-3`}
    >
      <i className={'fa fa-plus me-2'} />
      {t('addChildTag')}
    </Button>,
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

          <CursorPaginationManager<unknown, InterfaceTagData>
            query={USER_TAG_SUB_TAGS}
            queryOptions={{
              variables: {
                id: parentTagId,
                where: { name: { starts_with: tagSearchName } },
                sortedBy: { _id: tagSortOrder },
              },
              skip: !parentTagId,
            }}
            dataPath="getChildTags.childTags"
            itemsPerPage={TAGS_QUERY_DATA_CHUNK_SIZE}
            useExternalUI={true}
            refetchTrigger={refetchTrigger}
          >
            {({ items, loading, pageInfo, handleLoadMore, queryData }) => {
              // Extract ancestor tags from query data
              const orgUserTagAncestors =
                (queryData as { getChildTags?: InterfaceQueryUserTagChildTags })
                  ?.getChildTags?.ancestorTags || [];

              return (
                <>
                  <LoadingState
                    isLoading={loading}
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
                          onClick={() => navigate(`/orgtags/${orgId}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              navigate(`/orgtags/${orgId}`);
                            } else if (e.key === ' ') {
                              e.preventDefault();
                              navigate(`/orgtags/${orgId}`);
                            }
                          }}
                          className={`fs-6 ms-3 my-1 ${styles.tagsBreadCrumbs}`}
                          data-testid="allTagsBtn"
                        >
                          {t('tags')}
                          <i
                            className={'mx-2 fa fa-caret-right'}
                            aria-hidden="true"
                          />
                        </button>

                        {orgUserTagAncestors?.map(
                          (
                            tag: { _id: string; name: string },
                            index: number,
                          ) => (
                            <button
                              type="button"
                              key={tag._id}
                              className={`ms-2  ${tag._id === parentTagId ? `fs-4 fw-semibold text-secondary` : `${styles.tagsBreadCrumbs} fs-6`}`}
                              onClick={() =>
                                redirectToSubTags(tag._id as string)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  redirectToSubTags(tag._id as string);
                                } else if (e.key === ' ') {
                                  e.preventDefault();
                                  redirectToSubTags(tag._id as string);
                                }
                              }}
                              data-testid="redirectToSubTags"
                            >
                              {tag.name}

                              {orgUserTagAncestors.length - 1 !== index && (
                                <i
                                  className={'mx-2 fa fa-caret-right'}
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          ),
                        )}
                      </div>
                      <div
                        id="subTagsScrollableDiv"
                        data-testid="subTagsScrollableDiv"
                        className={styles.subTagsScrollableDiv}
                      >
                        <InfiniteScroll
                          dataLength={items.length}
                          next={handleLoadMore}
                          hasMore={pageInfo?.hasNextPage ?? false}
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
                          <DataGrid
                            disableColumnMenu
                            columnBufferPx={7}
                            hideFooter={true}
                            getRowId={(row) => row._id}
                            slots={{
                              noRowsOverlay: () => (
                                <Stack
                                  height="100%"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  {t('noTagsFound')}
                                </Stack>
                              ),
                            }}
                            sx={dataGridStyle}
                            getRowClassName={() => `${styles.rowBackground}`}
                            rowHeight={65}
                            rows={items}
                            columns={columns}
                            isRowSelectable={() => false}
                          />
                        </InfiniteScroll>
                      </div>
                    </div>
                  </LoadingState>
                </>
              );
            }}
          </CursorPaginationManager>
        </div>
      </Row>

      {/* Create Tag Modal */}
      <Modal
        show={addSubTagModalIsOpen}
        onHide={hideAddSubTagModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className={styles.modalHeader}
          data-testid="tagHeader"
          closeButton
        >
          <Modal.Title>{t('tagDetails')}</Modal.Title>
        </Modal.Header>
        <Form onSubmitCapture={addSubTag}>
          <Modal.Body>
            <Form.Label htmlFor="tagName">{t('tagName')}</Form.Label>
            <Form.Control
              type="name"
              id={'tagName'}
              className={`mb-3 ${styles.inputField}`}
              placeholder={t('tagNamePlaceholder')}
              data-testid="modalTitle"
              autoComplete="off"
              required
              value={tagName}
              onChange={(e): void => {
                setTagName(e.target.value);
              }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(): void => hideAddSubTagModal()}
              data-testid="addSubTagModalCloseBtn"
              className={styles.removeButton}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              value="add"
              data-testid="addSubTagSubmitBtn"
              className={styles.addButton}
              disabled={createUserTagLoading}
            >
              {createUserTagLoading ? tCommon('creating') : tCommon('create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default SubTags;
