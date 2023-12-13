import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import { Search } from '@mui/icons-material';
import Row from 'react-bootstrap/Row';
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
  createdAt: string;
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
    addMedia: '',
  });
  const [sortingOption, setSortingOption] = useState('latest');
  const [showTitle, setShowTitle] = useState(true);
  const [fileType, setFileType] = useState<string>(''); // Added state for file type
  const [file, setFile] = useState<File | null>(null);
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
      addMedia: '',
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
  const [displayedPosts, setDisplayedPosts] = useState(
    orgPostListData?.postsByOrganizationConnection.edges || []
  );

  useEffect(() => {
    if (orgPostListData && orgPostListData.postsByOrganizationConnection) {
      const newDisplayedPosts = sortPosts(
        orgPostListData.postsByOrganizationConnection.edges,
        sortingOption
      );
      setDisplayedPosts(newDisplayedPosts);
    }
  }, [orgPostListData, sortingOption]);

  const createPost = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const {
      posttitle: _posttitle,
      postinfo: _postinfo,
      postImage,
      postVideo,
      addMedia,
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
          file: postImage || postVideo || postformState.addMedia,
        },
      });

      if (data) {
        toast.success('Congratulations! You have Posted Something.');
        refetch();
        setPostFormState({
          posttitle: '',
          postinfo: '',
          postImage: '',
          postVideo: '',
          addMedia: '',
        });
        setPostModalIsOpen(false);
      }
    } catch (error: any) {
      errorHandler(t, error);
    }
  };

  if (createPostLoading || orgPostListLoading) {
    return <Loader />;
  }

  if (orgPostListError) {
    window.location.assign('/orglist');
  }
  const handleAddMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setPostFormState((prevPostFormState) => ({
      ...prevPostFormState,
      addMedia: '',
    }));

    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPostFormState({
        ...postformState,
        addMedia: await convertToBase64(selectedFile),
      });
    }
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

  const handleSorting = (option: string): void => {
    setSortingOption(option);
  };

  const sortPosts = (
    posts: InterfaceOrgPost[],
    sortingOption: string
  ): InterfaceOrgPost[] => {
    const sortedPosts = [...posts];

    if (sortingOption === 'latest') {
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortingOption === 'oldest') {
      sortedPosts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return sortedPosts;
  };

  const sortedPostsList: InterfaceOrgPost[] = [...displayedPosts];
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
      <OrganizationScreen screenName="Posts" title={t('title')}>
        <Row className={styles.head}>
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
                    {/* ... Dropdown code ... */}
                  </Dropdown>
                  <Dropdown
                    aria-expanded="false"
                    title="Sort Post"
                    data-testid="sort"
                  >
                    {/* ... Dropdown code ... */}
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
        </Row>
      </OrganizationScreen>
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
          </Modal.Body>
          <Modal.Body>
            <Form.Label htmlFor="addMedia">{t('addMedia')}</Form.Label>
            <Form.Control
              id="addMedia"
              name="addMedia"
              type="file"
              accept="image/*,video/*"
              placeholder={t('addMedia')}
              multiple={false}
              onChange={handleAddMediaChange}
              data-testid="addMediaField"
            />

            {postformState.addMedia && file && (
              <div className={styles.preview} data-testid="mediaPreview">
                {/* Display preview for both image and video */}
                {file.type.startsWith('image') ? (
                  <img src={postformState.addMedia} alt="Media Preview" />
                ) : (
                  <video controls>
                    <source src={postformState.addMedia} type={file.type} />(
                    {t('tag')})
                  </video>
                )}
                <button
                  className={styles.closeButton}
                  onClick={(): void => {
                    setPostFormState({
                      ...postformState,
                      addMedia: '',
                    });
                    const fileInput = document.getElementById(
                      'addMedia'
                    ) as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = '';
                    }
                  }}
                  data-testid="mediaCloseButton"
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
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
