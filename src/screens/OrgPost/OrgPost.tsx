import { useMutation, useQuery } from '@apollo/client';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import { GET_POSTS_BY_ORG } from '../../GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import { useParams } from 'react-router-dom';
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
import styles from '../../style/app.module.css';
import SortingButton from '../../subComponents/SortingButton';
import SearchingButton from 'subComponents/SearchingButton';
import SearchBar from 'subComponents/SearchBar';

interface InterfacePostNode {
  createdAt: string;
}

interface InterfacePostCreator {
  id: string;
  firstName?: string;
  lastName?: string;
}

interface InterfacePostNode {
  id: string;
  caption: string;
  text?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  creator?: InterfacePostCreator;
  pinned?: boolean;
}

interface InterfacePostEdge {
  node: InterfacePostNode;
  cursor: string;
}

interface InterfacePageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface InterfacePostConnection {
  edges: InterfacePostEdge[];
  pageInfo: InterfacePageInfo;
}

interface InterfaceOrganization {
  id: string;
  posts: InterfacePostConnection;
}

interface InterfaceOrganizationPostListData {
  organization: InterfaceOrganization;
}

// Define the proper interface for the mutation input
interface InterfaceMutationCreatePostInput {
  caption: string;
  organizationId: string;
  isPinned: boolean;
  attachments?: File[];
}

interface InterfaceAttachment {
  url: string;
}

interface InterfaceCreator {
  id: string;
}

interface InterfacePost {
  id: string;
  caption: string;
  createdAt: string;
  pinnedAt?: string | null;
  creator?: InterfaceCreator;
  attachments?: InterfaceAttachment[];
}

/**
 * OrgPost Component
 *
 * This component is responsible for rendering and managing organization posts.
 * It allows users to create, view, and navigate through posts associated with an organization.
 *
 * Features:
 * - Fetches and displays organization posts using GraphQL queries.
 * - Supports creating new posts with image/video uploads.
 * - Pagination for navigating between post pages.
 * - Search functionality for filtering posts by title or text.
 * - Sorting options to view the latest or oldest posts.
 * - Allows pinning posts for priority display.
 *
 * Dependencies:
 * - Apollo Client for GraphQL queries and mutations.
 * - React Bootstrap for styling and UI components.
 * - react-toastify for success and error notifications.
 * - i18next for internationalization.
 * - Utility functions like convertToBase64 and errorHandler.
 *
 * Props: None
 *
 * State:
 * - postmodalisOpen: boolean - Controls the visibility of the create post modal.
 * - postformState: object - Stores post form data (title, info, media, pinPost).
 * - sortingOption: string - Stores the current sorting option ('latest', 'oldest').
 * - file: File | null - Stores the selected media file.
 * - after, before: string | null | undefined - Cursor values for pagination.
 * - first, last: number | null - Number of posts to fetch for pagination.
 * - showTitle: boolean - Controls whether to search by title or text.
 *
 * GraphQL Queries:
 * - ORGANIZATION_POST_LIST: Fetches organization posts with pagination.
 * - CREATE_POST_MUTATION: Creates a new post for the organization.
 *
 */

function OrgPost(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPost',
  });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title');
  console.log('Page title set to:', t('title'));

  const [postmodalisOpen, setPostModalIsOpen] = useState(false);
  const [postformState, setPostFormState] = useState({
    posttitle: '',
    postinfo: '',
    postImage: '',
    postVideo: '',
    addMedia: '',
    pinPost: false,
  });
  console.log('Initial post form state:', postformState);

  const [sortingOption, setSortingOption] = useState('None');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [displayPosts, setDisplayPosts] = useState<InterfacePost[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const { orgId: currentUrl } = useParams();
  console.log('Current organization ID:', currentUrl);

  const [showTitle, setShowTitle] = useState(true);
  const [after, setAfter] = useState<string | null | undefined>(null);
  const [before, setBefore] = useState<string | null | undefined>(null);
  const [first, setFirst] = useState<number | null>(6);
  const [last, setLast] = useState<number | null>(null);
  const [sortedPosts, setSortedPosts] = useState<InterfacePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<InterfacePostEdge[]>([]);

  const [isFiltering, setIsFiltering] = useState(false);
  const {
    data,
    loading,
    error,
    refetch: refetchPosts,
  } = useQuery(GET_POSTS_BY_ORG, {
    variables: {
      input: {
        organizationId: currentUrl,
      },
    },
    fetchPolicy: 'network-only', // Always fetch fresh data
  });

  const showInviteModal = (): void => {
    console.log('Opening post modal');
    setPostModalIsOpen(true);
  };

  const hideInviteModal = (): void => {
    console.log('Closing post modal');
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
  } = useQuery<InterfaceOrganizationPostListData>(ORGANIZATION_POST_LIST, {
    variables: {
      input: { id: currentUrl as string },
      after: after ?? null,
      before: before ?? null,
      first: first,
      last: last,
    },
  });
  console.log('Fetched organization posts:', orgPostListData);

  const [create, { loading: createPostLoading }] =
    useMutation(CREATE_POST_MUTATION);

  const createPost = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log('Creating post with form state:', postformState);

    try {
      if (!postformState.posttitle.trim()) {
        throw new Error('Title field cannot be empty');
      }

      if (!currentUrl) {
        throw new Error('Organization ID is required');
      }

      // Create the typed input object
      const input: InterfaceMutationCreatePostInput = {
        caption: postformState.posttitle.trim(),
        organizationId: currentUrl,
        isPinned: postformState.pinPost,
      };

      if (file) {
        input.attachments = [file];
      }

      const { data } = await create({
        variables: {
          input,
        },
      });

      console.log('Post creation response:', data);

      if (data?.createPost) {
        toast.success(t('postCreatedSuccess') as string);
        await refetch();

        setPostFormState({
          posttitle: '',
          postinfo: '',
          postImage: '',
          postVideo: '',
          addMedia: '',
          pinPost: false,
        });
        setFile(null);
        setPostModalIsOpen(false);
      }
    } catch (error: unknown) {
      console.error('Error creating post:', error);
      errorHandler(t, error);
    }
  };

  const handleAddMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      console.log('Selected file:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });

      // Validate file type
      if (
        !selectedFile.type.startsWith('image/') &&
        !selectedFile.type.startsWith('video/')
      ) {
        toast.error('Please select an image or video file');
        return;
      }

      // Store the raw file
      setFile(selectedFile);

      // Create preview
      try {
        const base64 = await convertToBase64(selectedFile);
        setPostFormState((prev) => ({
          ...prev,
          addMedia: base64,
        }));
      } catch (error) {
        console.error('Preview generation error:', error);
        toast.error('Could not generate preview');
      }
    } else {
      setFile(null);
      setPostFormState((prev) => ({
        ...prev,
        addMedia: '',
      }));
    }
  };
  useEffect(() => {
    if (sortingOption !== 'None' && sortedPosts.length > 0) {
      const startIndex = (currentPage - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
      setDisplayPosts(paginatedPosts);
    }
  }, [currentPage, sortingOption, sortedPosts]);

  useEffect(() => {
    if (orgPostListError) {
      console.error('Organization post list error:', orgPostListError);
      // navigate('/orglist');
    }
  }, [orgPostListError]);

  useEffect(() => {
    if (data?.postsByOrganization) {
      const posts = [...data.postsByOrganization];

      // Sort posts based on the selected option
      const sorted = posts.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortingOption === 'oldest' ? dateA - dateB : dateB - dateA;
      });

      setSortedPosts(sorted);
    }
  }, [data, sortingOption]);

  if (createPostLoading || orgPostListLoading) {
    return <Loader />;
  }

  const handleSearch = (term: string): void => {
    console.log('Search term:', term);

    if (!term.trim()) {
      setIsFiltering(false);
      refetch({
        input: {
          id: currentUrl,
        },
        after: after || null,
        before: before || null,
        first: first || null,
        last: last || null,
      });
      return;
    }

    if (orgPostListData?.organization?.posts?.edges) {
      setIsFiltering(true);
      const filtered = orgPostListData.organization.posts.edges.filter(
        (edge) => {
          const post = edge.node;
          if (showTitle) {
            return post.caption.toLowerCase().includes(term.toLowerCase());
          }

          return post.text?.toLowerCase().includes(term.toLowerCase());
        },
      );
      setFilteredPosts(filtered);
    }
  };

  const handleSorting = (option: string): void => {
    console.log('Sorting option selected:', option);

    setCurrentPage(1);
    setSortingOption(option);

    if (option === 'None') {
      setDisplayPosts([]);

      refetchPosts({
        input: {
          organizationId: currentUrl,
        },
      });
      return;
    }

    if (!['latest', 'oldest'].includes(option)) {
      console.error('Invalid sorting option:', option);
      return;
    }

    if (loading || error || !data?.postsByOrganization) {
      return;
    }

    const posts = [...data.postsByOrganization];
    const sorted = posts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return option === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    setSortedPosts(sorted);

    // Set initial page of sorted posts
    const initialPosts = sorted.slice(0, postsPerPage);
    setDisplayPosts(initialPosts);
  };

  const renderContent = (): JSX.Element | null | (JSX.Element | null)[] => {
    if (loading) return <Loader />;
    if (error) return <div>Error loading posts</div>;

    // If sorting is None, show original filtered/unfiltered posts
    if (sortingOption === 'None') {
      if (isFiltering) {
        if (filteredPosts.length === 0) {
          return <NotFound title="post" keyPrefix="postNotFound" />;
        }

        return filteredPosts.map((edge: InterfacePostEdge) => {
          const post = edge.node;
          return (
            <OrgPostCard
              key={post.id}
              post={{
                id: post.id,
                caption: post.caption,
                createdAt: new Date(post.createdAt),
                pinnedAt: post.pinned ? new Date() : null,
                creatorId: post.creator?.id || null,
                attachments: [
                  ...(post.imageUrl
                    ? [
                        {
                          id: `${post.id}-image`,
                          postId: post.id,
                          name: post.imageUrl,
                          mimeType: 'image/jpeg',
                          createdAt: new Date(post.createdAt),
                        },
                      ]
                    : []),
                  ...(post.videoUrl
                    ? [
                        {
                          id: `${post.id}-video`,
                          postId: post.id,
                          name: post.videoUrl,
                          mimeType: 'video/mp4',
                          createdAt: new Date(post.createdAt),
                        },
                      ]
                    : []),
                ],
              }}
            />
          );
        });
      }

      if (!orgPostListData?.organization?.posts?.edges?.length) {
        return <NotFound title="post" keyPrefix="postNotFound" />;
      }

      return orgPostListData.organization.posts.edges.map(
        (edge: InterfacePostEdge) => {
          const post = edge.node;
          return (
            <OrgPostCard
              key={post.id}
              post={{
                id: post.id,
                caption: post.caption,
                createdAt: new Date(post.createdAt),
                pinnedAt: post.pinned ? new Date() : null,
                creatorId: post.creator?.id || null,
                attachments: [
                  ...(post.imageUrl
                    ? [
                        {
                          id: `${post.id}-image`,
                          postId: post.id,
                          name: post.imageUrl,
                          mimeType: 'image/jpeg',
                          createdAt: new Date(post.createdAt),
                        },
                      ]
                    : []),
                  ...(post.videoUrl
                    ? [
                        {
                          id: `${post.id}-video`,
                          postId: post.id,
                          name: post.videoUrl,
                          mimeType: 'video/mp4',
                          createdAt: new Date(post.createdAt),
                        },
                      ]
                    : []),
                ],
              }}
            />
          );
        },
      );
    }

    if (!displayPosts.length) {
      return <NotFound title="post" keyPrefix="postNotFound" />;
    }

    return displayPosts.map((post) => {
      const mediaAttachments = post.attachments
        ? post.attachments.map((attachment) => ({
            id: `${post.id}-${attachment.url.includes('video') ? 'video' : 'image'}`,
            postId: post.id,
            name: attachment.url,
            mimeType: attachment.url.includes('video')
              ? 'video/mp4'
              : 'image/jpeg',
            createdAt: new Date(post.createdAt),
          }))
        : [];

      return (
        <OrgPostCard
          key={post.id}
          post={{
            id: post.id,
            caption: post.caption,
            createdAt: new Date(post.createdAt),
            pinnedAt: post.pinnedAt ? new Date(post.pinnedAt) : null,
            creatorId: post.creator?.id || null,
            attachments: mediaAttachments,
          }}
        />
      );
    });
  };

  const handleNextPage = (): void => {
    if (sortingOption === 'None') {
      // Use GraphQL pagination for unsorted posts
      setAfter(
        orgPostListData?.organization?.posts?.pageInfo?.endCursor || null,
      );
      setBefore(null);
      setFirst(postsPerPage);
      setLast(null);
    } else {
      // Check if there are more posts to show
      const maxPage = Math.ceil(sortedPosts.length / postsPerPage);
      if (currentPage < maxPage) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  const handlePreviousPage = (): void => {
    if (sortingOption === 'None') {
      // Use GraphQL pagination for unsorted posts
      setBefore(
        orgPostListData?.organization?.posts?.pageInfo?.startCursor || null,
      );
      setAfter(null);
      setFirst(null);
      setLast(postsPerPage);
    } else {
      // Check if we're not on the first page
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const totalPages =
    sortingOption === 'None'
      ? Math.ceil(
          (orgPostListData?.organization?.posts?.edges?.length || 0) /
            postsPerPage,
        )
      : Math.ceil(sortedPosts.length / postsPerPage);

  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpagerightOrgPost}>
          <div className={styles.btnsContainerOrgPost}>
            <SearchBar
              placeholder={showTitle ? t('searchTitle') : t('searchText')}
              onSearch={handleSearch}
              inputTestId="searchByName"
            />
            <div className={styles.btnsBlockOrgPost}>
              <div className="d-flex">
                <SearchingButton
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
                    { label: 'Latest', value: 'latest' },
                    { label: 'Oldest', value: 'oldest' },
                    { label: 'None', value: 'None' },
                  ]}
                  selectedOption={sortingOption}
                  onSortChange={handleSorting}
                  dataTestIdPrefix="sortpost"
                  dropdownTestId="sort"
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
          <div className={`row ${styles.list_box}`}>{renderContent()}</div>
        </div>
        <div className="row m-lg-1 d-flex justify-content-center w-100">
          <div className="col-auto">
            <Button
              onClick={handlePreviousPage}
              className={`${styles.createButton} btn-sm`}
              disabled={currentPage <= 1}
              data-testid="previousButton"
            >
              {t('Previous')}
            </Button>
          </div>
          {sortingOption !== 'None' && (
            <div className="col-auto">
              <span className="mx-3">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
          <div className="col-auto">
            <Button
              onClick={handleNextPage}
              className={`${styles.createButton} btn-sm`}
              disabled={currentPage >= totalPages}
              data-testid="nextButton"
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
              className={`mb-3 ${styles.inputField}`}
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
              className={`mb-3 ${styles.inputField}`}
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
              className={`mb-3 ${styles.inputField}`}
            />

            {postformState.addMedia && file && (
              <div className={styles.previewOrgPost} data-testid="mediaPreview">
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
              className={styles.switch}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              className={styles.removeButton}
              onClick={(): void => hideInviteModal()}
              data-testid="closeOrganizationModal"
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              value="invite"
              data-testid="createPostBtn"
              className={`${styles.addButton} mt-2`}
            >
              {t('addPost')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default OrgPost;
