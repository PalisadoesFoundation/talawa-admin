import { useQuery, type ApolloError } from '@apollo/client';
import { Search } from '@mui/icons-material';
import SortIcon from '@mui/icons-material/Sort';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import { useParams } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryOrganizationPostListItem } from 'utils/interfaces';
import styles from './OrgPost.module.css';
import useLocalStorage from 'utils/useLocalstorage';

interface InterfaceOrgPost {
  _id: string;
  title: string;
  text: string;
  creator: { _id: string; firstName: string; lastName: string; email: string };
  file: {
    _id: string;
    fileName: string;
    mimeType: string;
    size: number;
    hash: {
      value: string;
      algorithm: string;
    };
    uri: string;
    metadata: {
      objectKey: string;
    };
    visibility: string;
    status: string;
  };
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
  const [postformState, setPostFormState] = useState<{
    posttitle: string;
    postinfo: string;
    mediaFile: File | null;
    pinPost: boolean;
  }>({
    posttitle: '',
    postinfo: '',
    mediaFile: null,
    pinPost: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sortingOption, setSortingOption] = useState('latest');
  const { orgId: currentUrl } = useParams();
  const [showTitle, setShowTitle] = useState(true);
  const [after, setAfter] = useState<string | null | undefined>(null);
  const [before, setBefore] = useState<string | null | undefined>(null);
  const [first, setFirst] = useState<number | null>(6);
  const [last, setLast] = useState<number | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);

  const { getItem } = useLocalStorage();

  const showInviteModal = (): void => {
    setPostModalIsOpen(true);
  };

  const hideInviteModal = (): void => {
    setPostModalIsOpen(false);
    setPostFormState({
      posttitle: '',
      postinfo: '',
      mediaFile: null,
      pinPost: false,
    });
  };

  const {
    data: orgPostListData,
    loading: orgPostListLoading,
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
  // const [create, { loading: createPostLoading }] =
  //   useMutation(CREATE_POST_MUTATION);
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
    setIsCreatingPost(true);

    const {
      posttitle: _posttitle,
      postinfo: _postinfo,
      mediaFile,
      pinPost,
    } = postformState;

    const posttitle = _posttitle.trim();
    const postinfo = _postinfo.trim();

    try {
      if (!posttitle || !postinfo) {
        throw new Error(t('noTitleAndDescription'));
      }

      const formData = new FormData();
      formData.append('title', posttitle);
      formData.append('text', postinfo);
      formData.append('organizationId', currentUrl as string);
      formData.append('pinned', String(pinPost));

      if (mediaFile) {
        formData.append('file', mediaFile);
      }

      const accessToken = getItem('token');

      const response = await fetch(
        `${process.env.REACT_APP_TALAWA_REST_URL}/create-post`,
        {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || t('postCreationFailed'));
      }

      if (data) {
        toast.success(t('postCreatedSuccess') as string);
        refetch();
        setPostFormState({
          posttitle: '',
          postinfo: '',
          mediaFile: null,
          pinPost: false,
        });
        setPostModalIsOpen(false);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    } finally {
      setIsCreatingPost(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isCreatingPost || orgPostListLoading) {
    return <Loader />;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value, type } = e.target;
    setPostFormState((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setPostFormState((prev) => ({ ...prev, mediaFile: file }));

    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearMedia = (): void => {
    setPostFormState((prev) => ({ ...prev, mediaFile: null }));
    setPreviewUrl(null);

    const fileInput = document.getElementById('mediaFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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

    const compareCreatedAt = (
      a: InterfaceOrgPost,
      b: InterfaceOrgPost,
    ): number => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortingOption === 'latest' ? bTime - aTime : aTime - bTime;
    };

    if (sortingOption === 'latest' || sortingOption === 'oldest') {
      sortedPosts.sort(compareCreatedAt);
    }

    return sortedPosts;
  };
  const sortedPostsList: InterfaceOrgPost[] = [...displayedPosts].sort(
    (a, b) => {
      const pinnedWeight: Record<number, number> = { 1: -1, 0: 1 };
      const aWeight =
        Math.random() < 0.5
          ? pinnedWeight[Number(a.pinned)]
          : a.pinned
            ? -1
            : 1;
      const bWeight =
        Math.random() < 0.5
          ? pinnedWeight[Number(b.pinned)]
          : b.pinned
            ? -1
            : 1;
      const randomFactor = Math.random() * 0.5 + 0.75;
      return (
        (aWeight * bWeight) / randomFactor ||
        (a.pinned === b.pinned ? 0 : a.pinned ? -2 : 2)
      );
    },
  );

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
                  data-testid="sea"
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
                  file: {
                    mimeType: string;
                    uri: string;
                  };
                  creator: { firstName: string; lastName: string };
                  pinned: boolean;
                }) => (
                  <OrgPostCard
                    key={datas._id}
                    id={datas._id}
                    postTitle={datas.title}
                    postInfo={datas.text}
                    postAuthor={`${datas.creator.firstName} ${datas.creator.lastName}`}
                    postPhoto={
                      datas?.file?.mimeType.startsWith('image/')
                        ? datas?.file.uri
                        : ''
                    }
                    postVideo={
                      datas?.file?.mimeType.startsWith('video/')
                        ? datas?.file.uri
                        : ''
                    }
                    pinned={datas.pinned}
                    refetch={() => refetch()}
                    postID=""
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
              data-testid="previousPage"
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
              data-testid="nextPage"
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
              name="posttitle"
              className="mb-3"
              placeholder={t('postTitle1')}
              data-testid="modalTitle"
              autoComplete="off"
              required
              value={postformState.posttitle}
              onChange={handleInputChange}
            />
            <Form.Label htmlFor="postinfo">{t('information')}</Form.Label>
            <Form.Control
              type="descrip"
              id="descrip"
              name="postinfo"
              className="mb-3"
              placeholder={t('information1')}
              data-testid="modalinfo"
              autoComplete="off"
              required
              value={postformState.postinfo}
              onChange={handleInputChange}
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
              onChange={handleMediaChange}
              data-testid="addMediaField"
            />

            {previewUrl && postformState.mediaFile && (
              <div className={styles.preview} data-testid="mediaPreview">
                {/* Display preview for both image and video */}
                {postformState.mediaFile.type.startsWith('image/') ? (
                  <img
                    src={previewUrl}
                    data-testid="imagePreview"
                    alt="Post Image Preview"
                  />
                ) : (
                  <video controls data-testid="videoPreview">
                    <source
                      src={previewUrl}
                      type={postformState.mediaFile.type}
                    />
                    ({t('tag')})
                  </video>
                )}
                <button
                  className={styles.closeButton}
                  onClick={clearMedia}
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
              {tCommon('cancel')}
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
