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
import debounce from 'utils/debounce';
import convertToBase64 from 'utils/convertToBase64';
import NotFound from 'components/NotFound/NotFound';
import { Form as StyleBox } from 'react-bootstrap';
import { errorHandler } from 'utils/errorHandler';

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
    postVideo: '',
  });
  const [showTitle, setShowTitle] = useState(true);

  const searchChange = (ev: any): void => {
    setShowTitle(ev.target.value === 'searchTitle');
  };

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
      console.log(data, postImage);
      /* istanbul ignore next */
      if (data) {
        toast.success('Congratulations! You have Posted Something.');
        refetch();
        setPostFormState({
          posttitle: '',
          postinfo: '',
          postImage: '',
          postVideo: '',
        });
        setPostModalIsOpen(false); // close the modal
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  if (createPostLoading || orgPostListLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (orgPostListError) {
    window.location.assign('/orglist');
  }

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

  return (
    <>
      <AdminNavbar targets={targets} url1={configUrl} />
      <Row className={styles.head}>
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
                orgPostListData.postsByOrganizationConnection.edges.map(
                  (datas: {
                    _id: string;
                    title: string;
                    text: string;
                    imageUrl: string;
                    videoUrl: string;
                    organizationId: string;
                    creator: { firstName: string; lastName: string };
                  }) => (
                    <OrgPostCard
                      key={datas._id}
                      id={datas._id}
                      postTitle={datas.title}
                      postInfo={datas.text}
                      postAuthor={`${datas.creator.firstName} ${datas.creator.lastName}`}
                      postPhoto={datas.imageUrl}
                      postVideo={datas.videoUrl}
                    />
                  )
                )
              ) : (
                <NotFound title="post" keyPrefix="postNotFound" />
              )}
            </div>
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
            {!postformState.postVideo && (
              <>
                <label htmlFor="postphoto" className={styles.orgphoto}>
                  {t('image')}:
                  <Form.Control
                    accept="image/*"
                    id="postphoto"
                    name="photo"
                    type="file"
                    multiple={false}
                    onChange={async (
                      e: React.ChangeEvent<HTMLInputElement>
                    ): Promise<void> => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPostFormState({
                          ...postformState,
                          postImage: await convertToBase64(file),
                        });
                      }
                    }}
                    data-testid="organisationImage"
                  />
                  {postformState.postImage && (
                    <div className={styles.preview}>
                      <img
                        src={postformState.postImage}
                        alt="Post Image Preview"
                      />
                      <button
                        className={styles.closeButton}
                        onClick={(): void => {
                          setPostFormState({
                            ...postformState,
                            postImage: '',
                          });
                          const fileInput = document.getElementById(
                            'postphoto'
                          ) as HTMLInputElement;
                          if (fileInput) {
                            fileInput.value = '';
                          }
                        }}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  )}
                </label>
              </>
            )}
            {!postformState.postImage && (
              <>
                <label htmlFor="postvideo">
                  {t('video')}:
                  <Form.Control
                    accept="video/*"
                    id="postvideo"
                    name="video"
                    type="file"
                    placeholder={t('video')}
                    multiple={false}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPostFormState({
                          ...postformState,
                          postVideo: URL.createObjectURL(file),
                        });
                      }
                    }}
                    data-testid="organisationVideo"
                  />
                </label>
                {postformState.postVideo && (
                  <div className={styles.preview}>
                    <video controls>
                      <source src={postformState.postVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      className={styles.closeButton}
                      onClick={(): void => {
                        setPostFormState({
                          ...postformState,
                          postVideo: '',
                        });
                        const fileInput = document.getElementById(
                          'postvideo'
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.value = '';
                        }
                      }}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                )}
              </>
            )}
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
