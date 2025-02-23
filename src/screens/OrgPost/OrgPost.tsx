import { useMutation, useQuery } from '@apollo/client';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import { GET_POSTS_BY_ORG } from '../../GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
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
import styles from '../../style/app-fixed.module.css';
import SortingButton from '../../subComponents/SortingButton';
import PostsRenderer from './Posts';
// import SearchingButton from 'subComponents/SearchingButton';
import SearchBar from 'subComponents/SearchBar';
import type {
  InterfacePostEdge,
  InterfaceOrganizationPostListData,
  InterfaceMutationCreatePostInput,
  InterfacePost,
} from '../../types/Post/interface';

// Add these at the top of your file if not already present

/**
 * OrgPost Component
 * This component is responsible for rendering and managing organization posts.
 */

function OrgPost(): JSX.Element {
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
  const [sortingOption, setSortingOption] = useState('None');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [displayPosts, setDisplayPosts] = useState<InterfacePost[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const { orgId: currentUrl } = useParams();
  const [showTitle, setShowTitle] = useState(true);
  const [after, setAfter] = useState<string | null | undefined>(null);
  const [before, setBefore] = useState<string | null | undefined>(null);
  const [first, setFirst] = useState<number | null>(6);
  const [last, setLast] = useState<number | null>(null);
  const [sortedPosts, setSortedPosts] = useState<InterfacePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<InterfacePostEdge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    fetchPolicy: 'network-only',
  });

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
  } = useQuery<InterfaceOrganizationPostListData>(ORGANIZATION_POST_LIST, {
    variables: {
      input: { id: currentUrl as string },
      after: after ?? null,
      before: before ?? null,
      first: first,
      last: last,
    },
  });

  const [create, { loading: createPostLoading }] =
    useMutation(CREATE_POST_MUTATION);

  const createPost = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

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

      // Handle file upload
      if (file instanceof File) {
        // With apollo-upload-client, we can directly pass the File object
        input.attachments = [file];
      }

      const { data } = await create({
        variables: {
          input,
        },
        context: {
          // Ensure the file upload request includes the required header
          headers: {
            'Apollo-Require-Preflight': 'true',
          },
        },
      });

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
      errorHandler(t, error);
    }
  };

  console.log(setShowTitle);
  const handleAddMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // Validate file type
      if (
        !selectedFile.type.startsWith('image/') &&
        !selectedFile.type.startsWith('video/')
      ) {
        toast.error('Please select an image or video file');
        return;
      }

      if (filteredPosts.length === 0) {
        console.log('No filtered posts found');
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
      } catch {
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
      // Add proper error handling here
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

  const content = (
    <PostsRenderer
      data-testid="posts-renderer"
      data-loading={loading}
      data-is-filtering={isFiltering}
      data-sorting-option={sortingOption}
      loading={loading}
      error={error}
      data={isFiltering ? data : orgPostListData}
      isFiltering={isFiltering}
      searchTerm={searchTerm}
      sortingOption={sortingOption}
      displayPosts={displayPosts}
    />
  );

  const handleSorting = (option: string): void => {
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

    const initialPosts = sorted.slice(0, postsPerPage);
    setDisplayPosts(initialPosts);
  };

  const handleSearch = async (term: string): Promise<void> => {
    setSearchTerm(term);

    try {
      const { data: searchData } = await refetchPosts({
        input: { organizationId: currentUrl },
      });

      if (!term.trim()) {
        setIsFiltering(false);
        setFilteredPosts([]);
        return;
      }

      if (searchData?.postsByOrganization) {
        setIsFiltering(true);

        const filtered = searchData.postsByOrganization.filter(
          (post: InterfacePost) =>
            post.caption.toLowerCase().includes(term.toLowerCase()),
        );
        setFilteredPosts(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching posts');
      setIsFiltering(false);
    }
  };

  const totalPages =
    sortingOption === 'None'
      ? Math.ceil(
          (orgPostListData?.organization?.posts?.totalCount || 0) /
            postsPerPage,
        )
      : Math.ceil(sortedPosts.length / postsPerPage);

  const hasPreviousPage =
    sortingOption === 'None'
      ? orgPostListData?.organization?.posts?.pageInfo?.hasPreviousPage
      : currentPage > 1;

  const hasNextPage =
    sortingOption === 'None'
      ? orgPostListData?.organization?.posts?.pageInfo?.hasNextPage
      : currentPage < totalPages;

  // Update the totalPages calculation

  // Update the handleNextPage function
  const handleNextPage = (): void => {
    if (sortingOption === 'None') {
      const endCursor =
        orgPostListData?.organization?.posts?.pageInfo?.endCursor;
      if (endCursor) {
        setAfter(endCursor);
        setBefore(null);
        setFirst(postsPerPage);
        setLast(null);
        // Reset the current page for proper tracking
        setCurrentPage((prev) => prev + 1);
      }
    } else {
      const maxPage = Math.ceil(sortedPosts.length / postsPerPage);
      if (currentPage < maxPage) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };
  const handlePreviousPage = (): void => {
    if (sortingOption === 'None') {
      const startCursor =
        orgPostListData?.organization?.posts?.pageInfo?.startCursor;
      if (startCursor) {
        setBefore(startCursor);
        setAfter(null);
        setFirst(null);
        setLast(postsPerPage);
        setCurrentPage((prev) => prev - 1);
      }
    } else {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
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
                {/* <SearchingButton
                  text="Search" 
                  dataTestIdPrefix="sort-button"
                  type="sort" 
                  className={`${styles.dropdown} `}
                /> */}
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
          <div className={`row ${styles.list_box}`}>{content}</div>
        </div>
        <div className="row m-lg-1 d-flex justify-content-center w-100">
          <div className="col-auto">
            <Button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
              data-testid="previous-page-button"
            >
              Previous
            </Button>
          </div>
          <div className="col-auto"></div>
          <div className="col-auto">
            <Button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              data-testid="next-page-button"
            >
              Next
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
