import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import styles from './OrgPost.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import { ORGANIZATION_POST_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import type { RootState } from 'state/reducers';
import PaginationList from 'components/PaginationList/PaginationList';
import debounce from 'utils/debounce';
import convertToBase64 from 'utils/convertToBase64';
import NotFound from 'components/NotFound/NotFound';
import { Form as StyleBox } from 'react-bootstrap';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';

function orgPost(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPost',
  });

  document.title = t('title');
  const [postmodalisOpen, setPostModalIsOpen] = useState(false);
  const [postformState, setPostFormState] = useState({
    posttitle: '',
    postinfo: '',
    postImage: '',
  });
  const [showTitle, setShowTitle] = useState(true);

  const searchChange = (ev: any): void => {
    setShowTitle(ev.target.value === 'searchTitle');
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const currentUrl = window.location.href.split('=')[1];
  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const showInviteModal = (): void => {
    setPostModalIsOpen(true);
  };
  const hideInviteModal = (): void => {
    setPostModalIsOpen(false);
  };

  const {
    data: orgPostListData,
    loading: orgPostListLoading,
    error: orgPostListError,
    refetch,
  } = useQuery(ORGANIZATION_POST_CONNECTION_LIST, {
    variables: { id: currentUrl, title_contains: '', text_contains: '' },
  });
  const [create, { loading: createPostLoading }] =
    useMutation(CREATE_POST_MUTATION);

  const createPost = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const {
      posttitle: _posttitle,
      postinfo: _postinfo,
      postImage,
    } = postformState;

    const posttitle = _posttitle.trim();
    const postinfo = _postinfo.trim();

    try {
      if (!posttitle || !postinfo) {
        throw new Error('Text fields cannot be empty strings');
      }

      const { data } = await create({
        variables: {
          title: posttitle,
          text: postinfo,
          organizationId: currentUrl,
          file: postImage,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success('Congratulations! You have Posted Something.');
        refetch();
        setPostFormState({
          posttitle: '',
          postinfo: '',
          postImage: '',
        });
        setPostModalIsOpen(false); // close the modal
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  if (createPostLoading || orgPostListLoading) {
    return <Loader />;
  }

  /* istanbul ignore next */
  if (orgPostListError) {
    window.location.assign('/orglist');
  }

  /* istanbul ignore next */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };
  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e: any): void => {
    const { value } = e.target;
    const filterData = {
      id: currentUrl,
      title_contains: showTitle ? value : null,
      text_contains: !showTitle ? value : null,
    };
    refetch(filterData);
  };

  const debouncedHandleSearch = debounce(handleSearch);

  // let ReversedPostsList;
  // //the above variable is defined to reverse the list of posts so the the most recently added posts should be displayed at the top.
  // if (data) {
  //   ReversedPostsList = data.postsByOrganizationConnection.edges
  //     .slice()
  //     .reverse();
  // }
  return (
    <>
      <AdminNavbar targets={targets} url1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>{t('searchPost')}</h6>
              <div className={styles.checkboxdiv}>
                <div key={`inline-radio`} className="mb-3">
                  <StyleBox.Check
                    inline
                    label={t('Title')}
                    name="radio-group"
                    type="radio"
                    value="searchTitle"
                    onChange={searchChange}
                    checked={showTitle}
                    className={styles.actionradio}
                    id={`inline-radio-1`}
                  />
                  <StyleBox.Check
                    inline
                    label={t('Text')}
                    name="radio-group"
                    type="radio"
                    value="searchText"
                    onChange={searchChange}
                    checked={!showTitle}
                    className={styles.actionradio}
                    id={`inline-radio-2`}
                  />
                </div>
              </div>
              <Form.Control
                type="text"
                id="posttitle"
                placeholder={showTitle ? t('searchTitle') : t('searchText')}
                autoComplete="off"
                onChange={debouncedHandleSearch}
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>{t('posts')}</p>
              <Button
                variant="success"
                className={styles.addbtn}
                onClick={showInviteModal}
                data-testid="createPostModalBtn"
              >
                + {t('createPost')}
              </Button>
            </Row>
            <div className={`row ${styles.list_box}`}>
              {orgPostListData &&
              orgPostListData.postsByOrganizationConnection.edges.length > 0 ? (
                (rowsPerPage > 0
                  ? orgPostListData.postsByOrganizationConnection.edges.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rowsPerPage > 0
                  ? orgPostListData.postsByOrganizationConnection.edges.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : orgPostListData.postsByOrganizationConnection.edges
                ).map(
                  (datas: {
                    _id: string;
                    title: string;
                    text: string;
                    imageUrl: string;
                    videoUrl: string;
                    organizationId: string;
                    creator: { firstName: string; lastName: string };
                  }) => {
                    return (
                      <OrgPostCard
                        key={datas._id}
                        id={datas._id}
                        postTitle={datas.title}
                        postInfo={datas.text}
                        postAuthor={`${datas.creator.firstName} ${datas.creator.lastName}`}
                        postPhoto={datas.imageUrl}
                        postVideo={datas.videoUrl}
                      />
                    );
                  }
                )
              ) : (
                <NotFound title="post" keyPrefix="postNotFound" />
              )}
            </div>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <PaginationList
                    count={
                      orgPostListData
                        ? orgPostListData.postsByOrganizationConnection.edges
                            .length
                        : 0
                    }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
      <Modal show={postmodalisOpen}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('postDetails')}</p>
          <Button variant="danger" onClick={hideInviteModal}>
            <i className="fa fa-times" data-testid="closePostModalBtn"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createPost}>
            <label htmlFor="posttitle">{t('postTitle')}</label>
            <Form.Control
              type="title"
              id="postitle"
              placeholder={t('ptitle')}
              autoComplete="off"
              required
              value={postformState.posttitle}
              onChange={(e): void => {
                setPostFormState({
                  ...postformState,
                  posttitle: e.target.value,
                });
              }}
            />
            <label htmlFor="postinfo">{t('information')}</label>
            <textarea
              id="postinfo"
              className={styles.postinfo}
              placeholder={t('postDes')}
              autoComplete="off"
              required
              value={postformState.postinfo}
              onChange={(e): void => {
                setPostFormState({
                  ...postformState,
                  postinfo: e.target.value,
                });
              }}
            />
            <label htmlFor="postphoto" className={styles.orgphoto}>
              {t('image')}:
              <Form.Control
                accept="image/*"
                id="postphoto"
                name="photo"
                type="file"
                multiple={false}
                onChange={async (e: React.ChangeEvent): Promise<void> => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files && target.files[0];
                  if (file)
                    setPostFormState({
                      ...postformState,
                      postImage: await convertToBase64(file),
                    });
                }}
                data-testid="organisationImage"
              />
            </label>
            <label htmlFor="postvideo">{t('video')}:</label>
            <Form.Control
              accept="image/*"
              id="postvideo"
              name="video"
              type="file"
              placeholder={t('video')}
              multiple={false}
              //onChange=""
            />
            <Button type="submit" variant="success" data-testid="createPostBtn">
              <i className="fa fa-plus"></i> {t('addPost')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default orgPost;
