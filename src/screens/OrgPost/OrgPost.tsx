import { useMutation, useQuery } from '@apollo/client';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
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
import SearchBar from 'subComponents/SearchBar';

// Define interfaces for the GraphQL response structure
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

  const [sortingOption, setSortingOption] = useState('latest');
  console.log('Initial sorting option:', sortingOption);

  const [file, setFile] = useState<File | null>(null);
  const { orgId: currentUrl } = useParams();
  console.log('Current organization ID:', currentUrl);

  const [showTitle, setShowTitle] = useState(true);
  const [after, setAfter] = useState<string | null | undefined>(null);
  const [before, setBefore] = useState<string | null | undefined>(null);
  const [first, setFirst] = useState<number | null>(6);
  const [last, setLast] = useState<number | null>(null);

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

      // Only add attachments if there's a file
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

        // Reset form
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

  // Updated file handling function
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
    if (orgPostListError) {
      console.error('Organization post list error:', orgPostListError);
      // navigate('/orglist');
    }
  }, [orgPostListError]);

  if (createPostLoading || orgPostListLoading) {
    return <Loader />;
  }

  const handleSearch = (term: string): void => {
    console.log('Search term:', term);
    refetch({
      input: {
        id: currentUrl,
        title_contains: showTitle ? term : null,
        text_contains: !showTitle ? term : null,
      },
      after: after || null,
      before: before || null,
      first: first || null,
      last: last || null,
    });
  };

  const handleSorting = (option: string): void => {
    console.log('Sorting option selected:', option);
    setSortingOption(option);
  };

  const handleNextPage = (): void => {
    console.log('Fetching next page');
    setAfter(orgPostListData?.organization?.posts?.pageInfo?.endCursor || null);
    setBefore(null);
    setFirst(6);
    setLast(null);
  };

  const handlePreviousPage = (): void => {
    console.log('Fetching previous page');
    setBefore(
      orgPostListData?.organization?.posts?.pageInfo?.startCursor || null,
    );
    setAfter(null);
    setFirst(null);
    setLast(6);
  };

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
            {orgPostListData?.organization?.posts?.edges &&
            orgPostListData.organization.posts.edges.length > 0 ? (
              orgPostListData.organization.posts.edges.map(
                (edge: InterfacePostEdge) => {
                  const post = edge.node;
                  return (
                    <OrgPostCard
                      key={post.id}
                      id={post.id}
                      postTitle={post.caption}
                      postInfo={post.text || ''}
                      postAuthor={`${post.creator?.firstName || ''} ${post.creator?.lastName || ''}`}
                      postPhoto={post.imageUrl || null}
                      postVideo={post.videoUrl || null}
                      pinned={post.pinned || false}
                      postID={''}
                    />
                  );
                },
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
                !orgPostListData?.organization?.posts?.pageInfo?.hasPreviousPage
              }
              data-testid="previousButton"
            >
              {t('Previous')}
            </Button>
          </div>
          <div className="col-auto">
            <Button
              onClick={handleNextPage}
              className={`${styles.createButton} btn-sm `}
              disabled={
                !orgPostListData?.organization?.posts?.pageInfo?.hasNextPage
              }
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
