import { useMutation, useQuery, type ApolloError } from '@apollo/client';
import { Search } from '@mui/icons-material';
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
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryOrganizationPostListItem } from 'utils/interfaces';
import styles from '../../style/app.module.css';
import SortingButton from '../../subComponents/SortingButton';

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

/**
 * This function is used to display the posts of the organization. It displays the posts in a card format.
 * It also provides the functionality to create a new post. The user can also sort the posts based on the date of creation.
 * The user can also search for a post based on the title of the post.
 * @returns JSX.Element which contains the posts of the organization.
 */
function orgPost(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPost',
  });
  const { t: tCommon } = useTranslation('common');

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
    refetch: (filterData?: {
      id: string | undefined;
      // title_contains: string | null;
      // text_contains: string | null;
      after: string | null | undefined;
      before: string | null | undefined;
      first: number | null;
      last: number | null;
    }) => void;
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: {
      id: currentUrl as string,
      after: after ?? null,
      before: before ?? null,
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
        toast.success(t('postCreatedSuccess') as string);
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
    } catch (error: unknown) {
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const filterData = {
      id: currentUrl,
      title_contains: showTitle ? value : null,
      text_contains: !showTitle ? value : null,
      after: after || null,
      before: before || null,
      first: first || null,
      last: last || null,
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
        <div className={styles.mainpagerightOrgPost}>
          <div className={styles.btnsContainerOrgPost}>
            <div className={styles.inputOrgPost}>
              <Form.Control
                type="text"
                id="posttitle"
                className={styles.inputField}
                placeholder={showTitle ? t('searchTitle') : t('searchText')}
                data-testid="searchByName"
                autoComplete="off"
                onChange={debouncedHandleSearch}
                required
              />
              <Button tabIndex={-1} className={`${styles.searchButton} `}>
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlockOrgPost}>
              <div className="d-flex">
                <SortingButton
                  title="SearchBy"
                  sortingOptions={[
                    { label: t('Text'), value: 'Text' },
                    { label: t('Title'), value: 'Title' },
                  ]}
                  selectedOption={showTitle ? t('Title') : t('Text')}
                  onSortChange={(value) => setShowTitle(value === 'Title')}
                  dataTestIdPrefix="searchBy"
                  buttonLabel={t('searchBy')}
                  className={`${styles.dropdown} `}
                />
                <SortingButton
                  title="Sort Post"
                  sortingOptions={[
                    { label: t('Latest'), value: 'latest' },
                    { label: t('Oldest'), value: 'oldest' },
                  ]}
                  selectedOption={sortingOption}
                  onSortChange={handleSorting}
                  dataTestIdPrefix="sortpost"
                  dropdownTestId="sort"
                  className={`${styles.dropdown} `}
                  buttonLabel={t('sortPost')}
                />
              </div>

              <Button
                variant="success"
                onClick={showInviteModal}
                data-testid="createPostModalBtn"
                className={`${styles.createButton} mb-2`}
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
                    postID={''}
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
              className={`${styles.createButton} btn-sm `}
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
              className={`${styles.createButton} btn-sm `}
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
        <Modal.Header data-testid="modalOrganizationHeader" closeButton>
          <Modal.Title>{t('postDetails')}</Modal.Title>
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
              <div className={styles.previewOrgPost} data-testid="mediaPreview">
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
                  className={styles.closeButtonOrgPost}
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
              className={styles.closeButtonOrgPost}
              onClick={(): void => hideInviteModal()}
              data-testid="closeOrganizationModal"
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              value="invite"
              data-testid="createPostBtn"
              className={`${styles.addButtonOrgPost} mt-2`}
            >
              {t('addPost')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default orgPost;
