import { useMutation, useQuery, type ApolloError } from '@apollo/client';
import { Search } from '@mui/icons-material';
import SortIcon from '@mui/icons-material/Sort';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import { useNavigate, useParams } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryOrganizationPostListItem } from 'utils/interfaces';
import styles from './OrgPost.module.css';

interface InterfaceOrgPost {
  _id: string;
  title: string;
  text: string;
  imageUrl: string | null;
  videoUrl: string | null;
  creator: { _id: string; firstName: string; lastName: string; email: string };
  pinned: boolean;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedBy: { _id: string }[];
  comments: {
    _id: string;
    text: string;
    creator: { _id: string };
    createdAt: string;
    likeCount: number;
    likedBy: { _id: string }[];
  }[];
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
    pinPost: false,
  });
  const [sortingOption, setSortingOption] = useState('latest');
  const [file, setFile] = useState<File | null>(null);
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(true);
  const [after, setAfter] = useState<string | null | undefined>(null);
  const [before, setBefore] = useState<string | null | undefined>(null);
  const [first, setFirst] = useState<number | null>(6);
  const [last, setLast] = useState<number | null>(null);

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
      pinPost: false,
    });
  };

  const {
    data: orgPostListData,
    loading: orgPostListLoading,
    error: orgPostListError,
    refetch,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationPostListItem[];
    };
    loading: boolean;
    error?: ApolloError;
    refetch: any;
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: {
      id: currentUrl,
      after: after,
      before: before,
      first: first,
      last: last,
    },
  });
  const [create, { loading: createPostLoading }] =
    useMutation(CREATE_POST_MUTATION);
  const [displayedPosts, setDisplayedPosts] = useState(
    orgPostListData?.organizations[0].posts.edges.map((edge) => edge.node) ||
      [],
  );

  // ...

  useEffect(() => {
    if (orgPostListData && orgPostListData.organizations) {
      const newDisplayedPosts: InterfaceOrgPost[] = sortPosts(
        orgPostListData.organizations[0].posts.edges.map((edge) => edge.node),
        sortingOption,
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
      pinPost,
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
          pinned: pinPost,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('postCreatedSuccess'));
        refetch();
        setPostFormState({
          posttitle: '',
          postinfo: '',
          postImage: '',
          postVideo: '',
          addMedia: '',
          pinPost: false,
        });
        setPostModalIsOpen(false);
      }
    } catch (error: any) {
      errorHandler(t, error);
    }
  };

  useEffect(() => {
    if (orgPostListError) {
      navigate('/orglist');
    }
  }, [orgPostListError]);

  if (createPostLoading || orgPostListLoading) {
    return <Loader />;
  }

  const handleAddMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
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

  const debouncedHandleSearch = handleSearch;

  const handleSorting = (option: string): void => {
    setSortingOption(option);
  };
  const handleNextPage = (): void => {
    setAfter(orgPostListData?.organizations[0].posts.pageInfo.endCursor);
    setBefore(null);
    setFirst(6);
    setLast(null);
  };
  const handlePreviousPage = (): void => {
    setBefore(orgPostListData?.organizations[0].posts.pageInfo.startCursor);
    setAfter(null);
    setFirst(null);
    setLast(6);
  };
  // console.log(orgPostListData?.organizations[0].posts);
  const sortPosts = (
    posts: InterfaceOrgPost[],
    sortingOption: string,
  ): InterfaceOrgPost[] => {
    const sortedPosts = [...posts];

    if (sortingOption === 'latest') {
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortingOption === 'oldest') {
      sortedPosts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    return sortedPosts;
  };

  const sortedPostsList: InterfaceOrgPost[] = [...displayedPosts];
  sortedPostsList.sort((a: InterfaceOrgPost, b: InterfaceOrgPost) => {
    if (a.pinned === b.pinned) {
      return 0;
    }
    /* istanbul ignore next */
    if (a.pinned) {
      return -1;
    }
    return 1;
  });

  return (
    <>
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
                  <Dropdown.Toggle
                    data-testid="searchBy"
                    variant="outline-success"
                  >
                    <SortIcon className={'me-1'} />
                    {t('searchBy')}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      id="searchText"
                      onClick={(e): void => {
                        setShowTitle(false);
                        e.preventDefault();
                      }}
                      data-testid="Text"
                    >
                      {t('Text')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="searchTitle"
                      onClick={(e): void => {
                        setShowTitle(true);
                        e.preventDefault();
                      }}
                      data-testid="searchTitle"
                    >
                      {t('Title')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  aria-expanded="false"
                  title="Sort Post"
                  data-testid="sort"
                >
                  <Dropdown.Toggle
                    variant="outline-success"
                    data-testid="sortpost"
                  >
                    <SortIcon className={'me-1'} />
                    {t('sortPost')}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={(): void => handleSorting('latest')}
                      data-testid="latest"
                    >
                      {t('Latest')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(): void => handleSorting('oldest')}
                      data-testid="oldest"
                    >
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
                  imageUrl: string | null;
                  videoUrl: string | null;

                  creator: { firstName: string; lastName: string };
                  pinned: boolean;
                }) => (
                  <OrgPostCard
                    key={datas._id}
                    id={datas._id}
                    postTitle={datas.title}
                    postInfo={datas.text}
                    postAuthor={`${datas.creator.firstName} ${datas.creator.lastName}`}
                    postPhoto={datas?.imageUrl}
                    postVideo={datas?.videoUrl}
                    pinned={datas.pinned}
                  />
                ),
              )
            ) : (
              <NotFound title="post" keyPrefix="postNotFound" />
            )}
          </div>
        </div>
        <div className="row m-lg-1 d-flex justify-content-center w-100">
          <div className="col-auto">
            <Button
              onClick={handlePreviousPage}
              className="btn-sm"
              disabled={
                !orgPostListData?.organizations[0].posts.pageInfo
                  .hasPreviousPage
              }
            >
              {t('Previous')}
            </Button>
          </div>
          <div className="col-auto">
            <Button
              onClick={handleNextPage}
              className="btn-sm "
              disabled={
                !orgPostListData?.organizations[0].posts.pageInfo.hasNextPage
              }
            >
              {t('Next')}
            </Button>
          </div>
        </div>
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
                  <img
                    src={postformState.addMedia}
                    data-testid="imagePreview"
                    alt="Post Image Preview"
                  />
                ) : (
                  <video controls data-testid="videoPreview">
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
                      'addMedia',
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
            <Form.Label htmlFor="pinpost" className="mt-3">
              {t('pinPost')}
            </Form.Label>
            <Form.Switch
              id="pinPost"
              type="checkbox"
              data-testid="pinPost"
              defaultChecked={postformState.pinPost}
              onChange={(): void =>
                setPostFormState({
                  ...postformState,
                  pinPost: !postformState.pinPost,
                })
              }
            />
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
