import { useMutation, useQuery } from '@apollo/client';
import { Search, WarningAmberRounded } from '@mui/icons-material';
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
import type { InterfaceQueryOrganizationUserTags } from 'utils/interfaces';
import styles from './OrganizationTags.module.css';
import { DataGrid } from '@mui/x-data-grid';
import type { InterfaceOrganizationTagsQuery } from 'utils/organizationTagsUtils';
import {
  dataGridStyle,
  TAGS_QUERY_PAGE_SIZE,
} from 'utils/organizationTagsUtils';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import InfiniteScroll from 'react-infinite-scroll-component';

/**
 * Component that renders the Organization Tags screen when the app navigates to '/orgtags/:orgId'.
 *
 * This component does not accept any props and is responsible for displaying
 * the content associated with the corresponding route.
 */

function OrganizationTags(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');

  const [createTagModalIsOpen, setCreateTagModalIsOpen] = useState(false);

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
    loading: orgUserTagsLoading,
    error: orgUserTagsError,
    refetch: orgUserTagsRefetch,
    fetchMore: orgUserTagsFetchMore,
  }: InterfaceOrganizationTagsQuery = useQuery(ORGANIZATION_USER_TAGS_LIST, {
    variables: {
      id: orgId,
      first: TAGS_QUERY_PAGE_SIZE,
    },
  });

  const loadMoreUserTags = (): void => {
    orgUserTagsFetchMore({
      variables: {
        first: TAGS_QUERY_PAGE_SIZE,
        after: orgUserTagsData?.organizations[0].userTags.pageInfo.endCursor,
      },
      updateQuery: (
        prevResult: { organizations: InterfaceQueryOrganizationUserTags[] },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult?: {
            organizations: InterfaceQueryOrganizationUserTags[];
          };
        },
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          organizations: [
            {
              ...prevResult.organizations[0],
              userTags: {
                ...prevResult.organizations[0].userTags,
                edges: [
                  ...prevResult.organizations[0].userTags.edges,
                  ...fetchMoreResult.organizations[0].userTags.edges,
                ],
                pageInfo: fetchMoreResult.organizations[0].userTags.pageInfo,
              },
            },
          ],
        };
      },
    });
  };

  const [create, { loading: createUserTagLoading }] =
    useMutation(CREATE_USER_TAG);

  const createTag = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await create({
        variables: {
          name: tagName,
          organizationId: orgId,
        },
      });

      if (data) {
        toast.success(t('tagCreationSuccess') as string);
        orgUserTagsRefetch();
        setTagName('');
        setCreateTagModalIsOpen(false);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (createUserTagLoading || orgUserTagsLoading) {
    return <Loader />;
  }

  if (orgUserTagsError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Organization Tags Data
            <br />
            {orgUserTagsError.message}
          </h6>
        </div>
      </div>
    );
  }

  const userTagsList = orgUserTagsData?.organizations[0].userTags.edges.map(
    (edge) => edge.node,
  );

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
            onClick={() => redirectToSubTags(params.row._id)}
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
      <Row>
        <div>
          <div className={styles.btnsContainer}>
            <div className={styles.input}>
              <Form.Control
                type="text"
                id="tagName"
                className="bg-white"
                placeholder={tCommon('search')}
                data-testid="searchByName"
                autoComplete="off"
                required
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <Dropdown
                aria-expanded="false"
                title="Sort Tags"
                data-testid="sort"
              >
                <Dropdown.Toggle
                  variant="outline-success"
                  data-testid="sortTags"
                >
                  <SortIcon className={'me-1'} />
                  {tCommon('sort')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item data-testid="latest">
                    {tCommon('Latest')}
                  </Dropdown.Item>
                  <Dropdown.Item data-testid="oldest">
                    {tCommon('Oldest')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Button
              variant="success"
              onClick={showCreateTagModal}
              data-testid="createTagBtn"
              className="ms-auto"
            >
              <i className={'fa fa-plus me-2'} />
              {t('createTag')}
            </Button>
          </div>

          <div className="mb-4">
            <div className="bg-white light border border-bottom-0 rounded-top mb-0 py-2 d-flex align-items-center">
              <div className="ms-3 my-1">
                <IconComponent name="Tag" />
              </div>

              <div className={`fs-4 ms-3 my-1 ${styles.tagsBreadCrumbs}`}>
                {'Tags'}
              </div>
            </div>
            <div
              id="orgUserTagsScrollableDiv"
              data-testid="orgUserTagsScrollableDiv"
              className={styles.orgUserTagsScrollableDiv}
            >
              <InfiniteScroll
                dataLength={userTagsList?.length ?? 0}
                next={loadMoreUserTags}
                hasMore={
                  orgUserTagsData?.organizations[0].userTags.pageInfo
                    .hasNextPage ?? false
                }
                loader={
                  <div className="simpleLoader">
                    <div className="spinner" />
                  </div>
                }
                scrollableTarget="orgUserTagsScrollableDiv"
              >
                <DataGrid
                  disableColumnMenu
                  columnBufferPx={7}
                  hideFooter={true}
                  getRowId={(row) => row._id}
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
                  rows={userTagsList?.map((fund, index) => ({
                    id: index + 1,
                    ...fund,
                  }))}
                  columns={columns}
                  isRowSelectable={() => false}
                />
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </Row>

      {/* Create Tag Modal */}
      <Modal
        show={createTagModalIsOpen}
        onHide={hideCreateTagModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className="bg-primary"
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title className="text-white">{t('tagDetails')}</Modal.Title>
        </Modal.Header>
        <Form onSubmitCapture={createTag}>
          <Modal.Body>
            <Form.Label htmlFor="tagName">{t('tagName')}</Form.Label>
            <Form.Control
              type="name"
              id="orgname"
              className="mb-3"
              placeholder={t('tagNamePlaceholder')}
              data-testid="tagNameInput"
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
              onClick={(): void => hideCreateTagModal()}
              data-testid="closeCreateTagModal"
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              value="invite"
              data-testid="createTagSubmitBtn"
            >
              {tCommon('create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default OrganizationTags;
