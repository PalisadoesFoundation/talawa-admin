import { useMutation, useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import SortIcon from '@mui/icons-material/Sort';
import Loader from 'components/Loader/Loader';
import IconComponent from 'components/IconComponent/IconComponent';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { InterfaceQueryUserTagChildTags } from 'utils/interfaces';
import styles from './SubTags.module.css';
import { DataGrid } from '@mui/x-data-grid';
import type {
  InterfaceOrganizationSubTagsQuery,
  SortedByType,
} from 'utils/organizationTagsUtils';
import {
  dataGridStyle,
  TAGS_QUERY_DATA_CHUNK_SIZE,
} from 'utils/organizationTagsUtils';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';

/**
 * Component that renders the SubTags screen when the app navigates to '/orgtags/:orgId/subtags/:tagId'.
 *
 * This component does not accept any props and is responsible for displaying
 * the content associated with the corresponding route.
 */

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

  const showAddSubTagModal = (): void => {
    setAddSubTagModalIsOpen(true);
  };

  const hideAddSubTagModal = (): void => {
    setAddSubTagModalIsOpen(false);
    setTagName('');
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
        if (!fetchMoreResult) /* istanbul ignore next */ return prevResult;

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

  const addSubTag = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await create({
        variables: {
          name: tagName,
          organizationId: orgId,
          parentTagId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('tagCreationSuccess') as string);
        subTagsRefetch();
        setTagName('');
        setAddSubTagModalIsOpen(false);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (subTagsError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading sub tags
          </h6>
        </div>
      </div>
    );
  }

  const subTagsList =
    subTagsData?.getChildTags.childTags.edges.map((edge) => edge.node) ??
    /* istanbul ignore next */ [];

  const parentTagName = subTagsData?.getChildTags.name;

  // get the ancestorTags array and push the current tag in it
  // used for the tag breadcrumbs
  const orgUserTagAncestors = [
    ...(subTagsData?.getChildTags.ancestorTags ?? []),
    {
      _id: parentTagId,
      name: parentTagName,
    },
  ];

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/subTags/${tagId}`);
  };

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
      headerName: 'Tag Name',
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
      headerName: 'Total Sub Tags',
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
          >
            {params.row.childTags.totalCount}
          </Link>
        );
      },
    },
    {
      field: 'totalAssignedUsers',
      headerName: 'Total Assigned Users',
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
      headerName: 'Actions',
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
            variant="outline-primary"
            onClick={() => redirectToManageTag(params.row._id)}
            data-testid="manageTagBtn"
          >
            {t('manageTag')}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpageright}>
          <div className={styles.btnsContainer}>
            <div className={styles.input}>
              <i className="fa fa-search position-absolute text-body-tertiary end-0 top-50 translate-middle" />
              <Form.Control
                type="text"
                id="tagName"
                className="bg-white"
                placeholder={tCommon('searchByName')}
                onChange={(e) => setTagSearchName(e.target.value.trim())}
                data-testid="searchByName"
                autoComplete="off"
              />
            </div>
            <div className={styles.btnsBlock}>
              <Dropdown
                aria-expanded="false"
                title="Sort Tag"
                data-testid="sort"
              >
                <Dropdown.Toggle
                  variant="outline-success"
                  data-testid="sortTags"
                >
                  <SortIcon className={'me-1'} />
                  {tagSortOrder === 'DESCENDING'
                    ? tCommon('Latest')
                    : tCommon('Oldest')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    data-testid="latest"
                    onClick={() => setTagSortOrder('DESCENDING')}
                  >
                    {tCommon('Latest')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    data-testid="oldest"
                    onClick={() => setTagSortOrder('ASCENDING')}
                  >
                    {tCommon('Oldest')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button
                variant="success"
                onClick={() => redirectToManageTag(parentTagId as string)}
                data-testid="manageCurrentTagBtn"
                className="mx-4"
              >
                {`${t('manageTag')} ${subTagsData?.getChildTags.name}`}
              </Button>
            </div>
            <Button
              variant="success"
              onClick={showAddSubTagModal}
              data-testid="addSubTagBtn"
              className="ms-auto"
            >
              <i className={'fa fa-plus me-2'} />
              {t('addChildTag')}
            </Button>
          </div>

          {subTagsLoading || createUserTagLoading ? (
            <Loader />
          ) : (
            <div className="mb-4">
              <div className="bg-white light border rounded-top mb-0 py-2 d-flex align-items-center">
                <div className="ms-3 my-1">
                  <IconComponent name="Tag" />
                </div>

                <div
                  onClick={() => navigate(`/orgtags/${orgId}`)}
                  className={`fs-6 ms-3 my-1 ${styles.tagsBreadCrumbs}`}
                  data-testid="allTagsBtn"
                >
                  {'Tags'}
                  <i className={'mx-2 fa fa-caret-right'} />
                </div>

                {orgUserTagAncestors?.map((tag, index) => (
                  <div
                    key={index}
                    className={`ms-2 my-1 ${tag._id === parentTagId ? `fs-4 fw-semibold text-secondary` : `${styles.tagsBreadCrumbs} fs-6`}`}
                    onClick={() => redirectToSubTags(tag._id as string)}
                    data-testid="redirectToSubTags"
                  >
                    {tag.name}

                    {orgUserTagAncestors.length - 1 !== index && (
                      <i className={'mx-2 fa fa-caret-right'} />
                    )}
                  </div>
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
                    /* istanbul ignore next */
                    false
                  }
                  loader={<InfiniteScrollLoader />}
                  scrollableTarget="subTagsScrollableDiv"
                >
                  <DataGrid
                    disableColumnMenu
                    columnBufferPx={7}
                    hideFooter={true}
                    getRowId={(row) => row.id}
                    slots={{
                      noRowsOverlay: /* istanbul ignore next */ () => (
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
                    autoHeight
                    rowHeight={65}
                    rows={subTagsList?.map((subTag, index) => ({
                      id: index + 1,
                      ...subTag,
                    }))}
                    columns={columns}
                    isRowSelectable={() => false}
                  />
                </InfiniteScroll>
              </div>
            </div>
          )}
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
          className="bg-primary"
          data-testid="tagHeader"
          closeButton
        >
          <Modal.Title className="text-white">{t('tagDetails')}</Modal.Title>
        </Modal.Header>
        <Form onSubmitCapture={addSubTag}>
          <Modal.Body>
            <Form.Label htmlFor="tagName">{t('tagName')}</Form.Label>
            <Form.Control
              type="name"
              id="tagname"
              className="mb-3"
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
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" value="add" data-testid="addSubTagSubmitBtn">
              {tCommon('create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default SubTags;
