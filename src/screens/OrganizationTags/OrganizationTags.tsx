import { useMutation, useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import Loader from 'components/Loader/Loader';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import IconComponent from 'components/IconComponent/IconComponent';
import type {
  InterfaceQueryOrganizationUserTags,
  InterfaceTagData,
} from 'utils/interfaces';
import styles from '../../style/app.module.css';
import { DataGrid } from '@mui/x-data-grid';
import type {
  InterfaceOrganizationTagsQuery,
  SortedByType,
} from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import SortingButton from 'subComponents/SortingButton';
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
    loading: orgUserTagsLoading,
    error: orgUserTagsError,
    refetch: orgUserTagsRefetch,
    fetchMore: orgUserTagsFetchMore,
  }: InterfaceOrganizationTagsQuery = useQuery(ORGANIZATION_USER_TAGS_LIST, {
    variables: {
      id: orgId,
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
      where: { name: { starts_with: tagSearchName } },
      sortedBy: { id: tagSortOrder },
    },
  });

  const loadMoreUserTags = (): void => {
    orgUserTagsFetchMore({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after:
          orgUserTagsData?.organizations?.[0]?.userTags?.pageInfo?.endCursor ??
          /* istanbul ignore next */
          null,
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
        if (!fetchMoreResult) /* istanbul ignore next */ return prevResult;

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

  useEffect(() => {
    orgUserTagsRefetch();
  }, []);

  const [create, { loading: createUserTagLoading }] =
    useMutation(CREATE_USER_TAG);

  const createTag = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!tagName.trim()) {
      toast.error(t('enterTagName'));
      return;
    }

    try {
      const { data } = await create({
        variables: {
          name: tagName,
          organizationId: orgId,
        },
      });

      if (data) {
        toast.success(t('tagCreationSuccess'));
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
      renderCell: (params: GridCellParams<InterfaceTagData>) => {
        return (
          <div className="d-flex">
            {params.row.parentTag &&
              params.row.ancestorTags?.map((tag) => (
                <div
                  key={tag._id}
                  className={styles.tagsBreadCrumbs}
                  data-testid="ancestorTagsBreadCrumbs"
                >
                  {tag.name}
                  <i className={'mx-2 fa fa-caret-right'} />
                </div>
              ))}

            <div
              className={styles.subTagsLink}
              data-testid="tagName"
              onClick={() => redirectToSubTags(params.row._id)}
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
            className={styles.addButton}
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
          <div className={styles.btnsContainer}>
            <div className={styles.input}>
              <i className="fa fa-search position-absolute text-body-tertiary end-0 top-50 translate-middle" />
              <Form.Control
                type="text"
                id="tagName"
                className={styles.inputField}
                placeholder={tCommon('searchByName')}
                data-testid="searchByName"
                onChange={(e) => setTagSearchName(e.target.value.trim())}
                autoComplete="off"
              />
            </div>
            <div className={styles.btnsBlock}>
              <SortingButton
                title="Sort Tags"
                sortingOptions={[
                  { label: tCommon('Latest'), value: 'latest' },
                  { label: tCommon('Oldest'), value: 'oldest' },
                ]}
                selectedOption={
                  tagSortOrder === 'DESCENDING'
                    ? tCommon('Latest')
                    : tCommon('Oldest')
                }
                onSortChange={handleSortChange}
                dataTestIdPrefix="sortTags"
                className={styles.dropdown}
              />
            </div>
            <div>
              <Button
                onClick={showCreateTagModal}
                data-testid="createTagBtn"
                className={`${styles.createButton} mb-2`}
              >
                <i className={'fa fa-plus me-2'} />
                {t('createTag')}
              </Button>
            </div>
          </div>

          {orgUserTagsLoading || createUserTagLoading ? (
            <Loader />
          ) : (
            <div className="mb-4">
              <div className="bg-white border light rounded-top mb-0 py-2 d-flex align-items-center">
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
                    orgUserTagsData?.organizations?.[0]?.userTags?.pageInfo
                      ?.hasNextPage ?? /* istanbul ignore next */ false
                  }
                  loader={<InfiniteScrollLoader />}
                  scrollableTarget="orgUserTagsScrollableDiv"
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
                    sx={{
                      borderRadius: 'var(--table-head-radius)',
                      backgroundColor: 'var(--grey-bg-color)',
                      '& .MuiDataGrid-row': {
                        backgroundColor: 'var(--tablerow-bg-color)',
                        '&:focus-within': {
                          outlineOffset: '-2px',
                        },
                      },
                      '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'var(--grey-bg-color)',
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                      },
                      '& .MuiDataGrid-row.Mui-hovered': {
                        backgroundColor: 'var(--grey-bg-color)',
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                      },
                      '& .MuiDataGrid-cell:focus': {
                        outlineOffset: '-2px',
                      },
                    }}
                    getRowClassName={() => `${styles.rowBackground}`}
                    autoHeight
                    rowHeight={65}
                    rows={userTagsList?.map((userTag, index) => ({
                      id: index + 1,
                      ...userTag,
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
        show={createTagModalIsOpen}
        onHide={hideCreateTagModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className={styles.tableHeader}
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title>{t('tagDetails')}</Modal.Title>
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
              className={styles.closeButton}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              value="invite"
              data-testid="createTagSubmitBtn"
              className={styles.addButton}
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
