import { useMutation, useQuery, type ApolloError } from '@apollo/client';
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
import type { InterfaceQueryUserTagChildTags } from 'utils/interfaces';
import styles from './SubTags.module.css';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyle } from 'utils/organizationTagsUtils';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import {
  CREATE_USER_TAG,
  REMOVE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import {
  USER_TAG_ANCESTORS,
  USER_TAG_SUB_TAGS,
} from 'GraphQl/Queries/userTagQueries';

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

  const [after, setAfter] = useState<string | null | undefined>(null);
  const [before, setBefore] = useState<string | null | undefined>(null);
  const [first, setFirst] = useState<number | null>(5);
  const [last, setLast] = useState<number | null>(null);

  const [tagName, setTagName] = useState<string>('');

  const [removeUserTagId, setRemoveUserTagId] = useState(null);
  const [removeUserTagModalIsOpen, setRemoveUserTagModalIsOpen] =
    useState(false);

  const showAddSubTagModal = (): void => {
    setAddSubTagModalIsOpen(true);
  };

  const hideAddSubTagModal = (): void => {
    setAddSubTagModalIsOpen(false);
    setTagName('');
  };

  const {
    data: subTagsData,
    loading: subTagsLoading,
    error: subTagsError,
    refetch: subTagsRefetch,
  }: {
    data?: {
      getUserTag: InterfaceQueryUserTagChildTags;
    };
    loading: boolean;
    error?: ApolloError;
    refetch: () => void;
  } = useQuery(USER_TAG_SUB_TAGS, {
    variables: {
      id: parentTagId,
      after: after,
      before: before,
      first: first,
      last: last,
    },
  });

  const {
    data: orgUserTagAncestorsData,
    loading: orgUserTagsAncestorsLoading,
    error: orgUserTagsAncestorsError,
  }: {
    data?: {
      getUserTagAncestors: {
        _id: string;
        name: string;
      }[];
    };
    loading: boolean;
    error?: ApolloError;
    refetch: () => void;
  } = useQuery(USER_TAG_ANCESTORS, {
    variables: {
      id: parentTagId,
    },
  });

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
        toast.success(t('tagCreationSuccess'));
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

  const [removeUserTag] = useMutation(REMOVE_USER_TAG);
  const handleRemoveUserTag = async (): Promise<void> => {
    try {
      await removeUserTag({
        variables: {
          id: removeUserTagId,
        },
      });

      subTagsRefetch();
      toggleRemoveUserTagModal();
      toast.success(t('tagRemovalSuccess'));
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (createUserTagLoading || subTagsLoading || orgUserTagsAncestorsLoading) {
    return <Loader />;
  }

  const handleNextPage = (): void => {
    setAfter(subTagsData?.getUserTag.childTags.pageInfo.endCursor);
    setBefore(null);
    setFirst(5);
    setLast(null);
  };

  const handlePreviousPage = (): void => {
    setBefore(subTagsData?.getUserTag.childTags.pageInfo.startCursor);
    setAfter(null);
    setFirst(null);
    setLast(5);
  };

  if (subTagsError || orgUserTagsAncestorsError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading{' '}
            {subTagsError ? 'sub tags' : 'tag ancestors'}
            <br />
            {subTagsError
              ? subTagsError.message
              : orgUserTagsAncestorsError?.message}
          </h6>
        </div>
      </div>
    );
  }

  const userTagsList = subTagsData?.getUserTag.childTags.edges.map(
    (edge) => edge.node,
  );

  const orgUserTagAncestors = orgUserTagAncestorsData?.getUserTagAncestors;

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/subtags/${tagId}`);
  };

  const toggleRemoveUserTagModal = (): void => {
    if (removeUserTagModalIsOpen) {
      setRemoveUserTagId(null);
    }
    setRemoveUserTagModalIsOpen(!removeUserTagModalIsOpen);
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
            to={`/orgtags/${orgId}/subtags/${params.row._id}`}
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
            to={`/orgtags/${orgId}/orgtagdetails/${params.row._id}`}
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
          <div className="d-flex justify-content-center align-items-center">
            <Button
              size="sm"
              className="btn btn-primary rounded mt-3"
              onClick={() => redirectToManageTag(params.row._id)}
              data-testid="manageTagBtn"
            >
              {t('manageTag')}
            </Button>

            <Button
              size="sm"
              className="ms-2 btn btn-danger rounded mt-3"
              onClick={() => {
                setRemoveUserTagId(params.row._id);
                toggleRemoveUserTagModal();
              }}
              data-testid="removeUserTagBtn"
            >
              {t('removeTag')}
            </Button>
          </div>
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
                title="Sort Tag"
                data-testid="sort"
              >
                <Dropdown.Toggle
                  variant="outline-success"
                  data-testid="sortTag"
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

              <Button
                variant="success"
                onClick={() => redirectToManageTag(parentTagId as string)}
                data-testid="manageCurrentTagBtn"
                className="mx-4"
              >
                {`${t('manageTag')} ${subTagsData?.getUserTag.name}`}
              </Button>

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
          </div>

          <div>
            <div className="bg-white light border border-bottom-0 rounded-top mb-0 py-2 d-flex align-items-center">
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
          </div>
        </div>

        <div className="row m-md-3 d-flex justify-content-center w-100">
          <div className="col-auto">
            <Button
              onClick={handlePreviousPage}
              className="btn-sm"
              disabled={
                !subTagsData?.getUserTag.childTags.pageInfo.hasPreviousPage
              }
              data-testid="previousPageBtn"
            >
              <i className={'mx-2 fa fa-caret-left'} />
            </Button>
          </div>
          <div className="col-auto">
            <Button
              onClick={handleNextPage}
              className="btn-sm"
              disabled={!subTagsData?.getUserTag.childTags.pageInfo.hasNextPage}
              data-testid="nextPagBtn"
            >
              <i className={'mx-2 fa fa-caret-right'} />
            </Button>
          </div>
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

      {/* Remove User Tag Modal */}
      <Modal
        size="sm"
        id={`deleteActionItemModal`}
        show={removeUserTagModalIsOpen}
        onHide={toggleRemoveUserTagModal}
        backdrop="static"
        keyboard={false}
        className={styles.actionItemModal}
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`removeUserTag`}>
            {t('removeUserTag')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('removeUserTagMessage')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleRemoveUserTagModal}
            data-testid="removeUserTagModalCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={handleRemoveUserTag}
            data-testid="removeUserTagSubmitBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SubTags;
