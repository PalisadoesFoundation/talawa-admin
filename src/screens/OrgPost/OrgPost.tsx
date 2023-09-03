import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Search } from '@mui/icons-material';
import SortIcon from '@mui/icons-material/Sort';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './OrgPost.module.css';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import { ORGANIZATION_POST_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import type { RootState } from 'state/reducers';
import PaginationList from 'components/PaginationList/PaginationList';
import debounce from 'utils/debounce';
import convertToBase64 from 'utils/convertToBase64';
import NotFound from 'components/NotFound/NotFound';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';

interface InterfaceOrgPost {
  _id: string;
  title: string;
  text: string;
  imageUrl: string;
  videoUrl: string;
  organizationId: string;
  creator: { firstName: string; lastName: string };
  pinned: boolean;
}

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

  const currentUrl = window.location.href.split('=')[1];

  const showInviteModal = (): void => {
    setPostModalIsOpen(true);
  };
  const hideInviteModal = (): void => {
    setPostModalIsOpen(false);
    setPostFormState({
      posttitle: '',
      postinfo: '',
      postImage: '',
      postVideo: '',
    });
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
      postVideo,
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
          file: postImage || postVideo,
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
    return <Loader />;
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
  const sortedPostsList: InterfaceOrgPost[] = [
    ...orgPostListData.postsByOrganizationConnection.edges,
  ];

  sortedPostsList.sort((a: InterfaceOrgPost, b: InterfaceOrgPost) => {
    if (a.pinned === b.pinned) {
      return 0;
    }

    if (a.pinned) {
      return -1;
    }

    return 1;
  });
  return (
    <>
      <Row className={styles.head}>
        <Col sm={3}></Col>
        <Col sm={8}>
          <p className={styles.logintitle}>{t('posts')}</p>

          <div className={styles.mainpageright}>
            <div className={styles.btnsContainer}>
              <div className={styles.input}>
                <Form.Control
                  type="text"
                  id="posttitle"
                  className="bg-white"
                  placeholder={showTitle ? t('searchTitle') : t('searchText')}
                  data-testid="searchByName"
                  autoComplete="off"
                  onChange={debouncedHandleSearch}
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
                <div className="d-flex">
                  <Dropdown
                    aria-expanded="false"
                    title="SearchBy"
                    data-tesid="sea"
                  >
                    <Dropdown.Toggle
                      data-testid="searchBy"
                      variant="outline-success"
                    >
                      <SortIcon className={'me-1'} />
                      {t('searchBy')}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        value="searchText"
                        onClick={(e): void => {
                          setShowTitle(false);
                          e.preventDefault();
                        }}
                        data-testid="Text"
                      >
                        Text
                      </Dropdown.Item>
                      <Dropdown.Item
                        value="searchTitle"
                        onClick={(e): void => {
                          setShowTitle(true);
                          e.preventDefault();
                        }}
                        data-testid="searchTitle"
                      >
                        Title
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown
                    aria-expanded="false"
                    title="Sort Post"
                    data-testid="sort"
                  >
                    <Dropdown.Toggle variant="outline-success">
                      <SortIcon className={'me-1'} />
                      Sort Post
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">
                        {t('Latest')}
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                        {t('Oldest')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <Button
                  variant="success"
                  onClick={showInviteModal}
                  data-testid="createPostModalBtn"
                >
                  <i className={'fa fa-plus me-2'} />
                  {t('createPost')}
                </Button>
              </div>
            </div>
            <div className={`row ${styles.list_box}`}>
              {sortedPostsList && sortedPostsList.length > 0 ? (
                sortedPostsList.map(
                  (datas: {
                    _id: string;
                    title: string;
                    text: string;
                    imageUrl: string;
                    videoUrl: string;
                    organizationId: string;
                    creator: { firstName: string; lastName: string };
                    pinned: boolean;
                  }) => (
                    <OrgPostCard
                      key={datas._id}
                      id={datas._id}
                      postTitle={datas.title}
                      postInfo={datas.text}
                      postAuthor={`${datas.creator.firstName} ${datas.creator.lastName}`}
                      postPhoto={datas.imageUrl}
                      postVideo={datas.videoUrl}
                      pinned={datas.pinned}
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

      <Modal
        show={postmodalisOpen}
        onHide={hideInviteModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className="bg-primary"
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title className="text-white">{t('postDetails')}</Modal.Title>
        </Modal.Header>
        <Form onSubmitCapture={createPost}>
          <Modal.Body>
            <Form.Label htmlFor="posttitle">{t('postTitle')}</Form.Label>
            <Form.Control
              type="name"
              id="orgname"
              className="mb-3"
              placeholder={t('postTitle1')}
              data-testid="modalTitle"
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
            <Form.Label htmlFor="postinfo">{t('information')}</Form.Label>
            <Form.Control
              type="descrip"
              id="descrip"
              className="mb-3"
              placeholder={t('information1')}
              data-testid="modalinfo"
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
                <Form.Label htmlFor="postPhoto">{t('image')}</Form.Label>
                <Form.Control
                  accept="image/*"
                  id="postphoto"
                  name="photo"
                  type="file"
                  multiple={false}
                  onChange={async (
                    e: React.ChangeEvent<HTMLInputElement>
                  ): Promise<void> => {
                    setPostFormState((prevPostFormState) => ({
                      ...prevPostFormState,
                      postImage: '',
                    }));
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
                      data-testid="org"
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
                      data-testid="closeimage"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                )}
              </>
            )}
            {!postformState.postImage && (
              <>
                <Form.Label htmlFor="postvideo">{t('video')}</Form.Label>
                <Form.Control
                  accept="video/*"
                  id="postvideo"
                  name="video"
                  type="file"
                  placeholder={t('video')}
                  multiple={false}
                  onChange={async (e: React.ChangeEvent): Promise<void> => {
                    setPostFormState((prevPostFormState) => ({
                      ...prevPostFormState,
                      postVideo: '',
                    }));
                    const target = e.target as HTMLInputElement;
                    const file = target.files && target.files[0];
                    if (file) {
                      const videoBase64 = await convertToBase64(file);
                      setPostFormState({
                        ...postformState,
                        postVideo: videoBase64,
                      });
                    }
                  }}
                  data-testid="organisationVideo"
                />

                {postformState.postVideo && (
                  <div className={styles.preview} data-testid="videoPreview">
                    <video controls>
                      <source
                        src={postformState.postVideo}
                        type="video/mp4"
                        data-testid="videoPreview"
                      />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      className={styles.closeButton}
                      data-testid="videoclosebutton"
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
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(): void => hideInviteModal()}
              data-testid="closeOrganizationModal"
            >
              {t('cancel')}
            </Button>
            <Button type="submit" value="invite" data-testid="createPostBtn">
              {t('addPost')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
export default orgPost;
