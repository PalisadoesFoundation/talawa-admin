import React, { ChangeEvent, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import { Form } from 'antd';
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
import { RootState } from 'state/reducers';
import PaginationList from 'components/PaginationList/PaginationList';
import debounce from 'utils/debounce';
import convertToBase64 from 'utils/convertToBase64';
import PostNotFound from 'components/PostNotFound/PostNotFound';
import { Form as StyleBox } from 'react-bootstrap';
import { errorHandler } from 'utils/errorHandler';

function OrgPost(): JSX.Element {
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

  const searchChange = (ev: any) => {
    setShowTitle(ev.target.value === 'searchTitle');
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const currentUrl = window.location.href.split('=')[1];
  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const showInviteModal = () => {
    setPostModalIsOpen(true);
  };
  const hideInviteModal = () => {
    setPostModalIsOpen(false);
  };

  const {
    data,
    loading: loading2,
    error: error_post,
    refetch,
  } = useQuery(ORGANIZATION_POST_CONNECTION_LIST, {
    variables: { id: currentUrl, title_contains: '', text_contains: '' },
  });
  const [create, { loading }] = useMutation(CREATE_POST_MUTATION);

  const CreatePost = async (e: ChangeEvent<HTMLFormElement>) => {
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

  if (loading || loading2) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error_post) {
    window.location.assign('/orglist');
  }

  /* istanbul ignore next */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e: any) => {
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
      <AdminNavbar targets={targets} url_1={configUrl} />
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
              <input
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
              {data && data.postsByOrganizationConnection.edges.length > 0 ? (
                (rowsPerPage > 0
                  ? data.postsByOrganizationConnection.edges.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rowsPerPage > 0
                  ? data.postsByOrganizationConnection.edges.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : data.postsByOrganizationConnection.edges
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
                <PostNotFound title="post" />
              )}
            </div>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <PaginationList
                    count={
                      data ? data.postsByOrganizationConnection.edges.length : 0
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
      <Modal
        isOpen={postmodalisOpen}
        style={{
          overlay: { backgroundColor: 'grey' },
        }}
        className={styles.modalbody}
        ariaHideApp={false}
      >
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <div className={styles.flexdir}>
              <p className={styles.titlemodal}>{t('postDetails')}</p>
              <a onClick={hideInviteModal} className={styles.cancel}>
                <i className="fa fa-times" data-testid="closePostModalBtn"></i>
              </a>
            </div>
            <Form onSubmitCapture={CreatePost}>
              <label htmlFor="posttitle">{t('postTitle')}</label>
              <input
                type="title"
                id="postitle"
                placeholder={t('ptitle')}
                autoComplete="off"
                required
                value={postformState.posttitle}
                onChange={(e) => {
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
                onChange={(e) => {
                  setPostFormState({
                    ...postformState,
                    postinfo: e.target.value,
                  });
                }}
              />
              <label htmlFor="postphoto" className={styles.orgphoto}>
                {t('image')}:
                <input
                  accept="image/*"
                  id="postphoto"
                  name="photo"
                  type="file"
                  multiple={false}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
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
              <input
                accept="image/*"
                id="postvideo"
                name="video"
                type="file"
                placeholder={t('video')}
                multiple={false}
                //onChange=""
              />
              <Button
                type="submit"
                className={styles.greenregbtn}
                variant="success"
                data-testid="createPostBtn"
              >
                <i className="fa fa-plus"></i> {t('addPost')}
              </Button>
            </Form>
          </div>
        </section>
      </Modal>
    </>
  );
}
export default OrgPost;
