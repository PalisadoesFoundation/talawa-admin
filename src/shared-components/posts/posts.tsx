/**
 * Posts Component
 *
 * This component manages and displays organization posts with comprehensive functionality
 * including pagination, search, sorting, pinning, and infinite scroll. It renders both
 * pinned posts in a carousel layout and regular posts in a paginated list with interactive
 * features for post management.
 *
 * @returns A JSX element representing the complete posts interface with:
 * - Header with search and sorting controls
 * - Pinned posts carousel section
 * - Paginated posts list with infinite scroll
 * - Modal for viewing individual pinned posts
 * - Loading states and error handling
 *
 * @remarks
 * - Uses Apollo Client for GraphQL queries (ORGANIZATION_POST_LIST_WITH_VOTES, ORGANIZATION_PINNED_POST_LIST)
 * - Implements search functionality that filters posts by caption text
 * - Supports sorting by creation date (oldest/newest) with local state management
 * - Features infinite scroll pagination for better performance with large post lists
 * - Handles pinned posts separately in a carousel layout at the top
 * - Provides modal view for detailed pinned post interaction
 * - Includes comprehensive error handling and loading states
 * - Uses React hooks for state management and side effects
 * - Supports both admin and user role-based interactions
 * - Implements proper data formatting for PostCard components
 *
 * Dependencies:
 * - Apollo Client for GraphQL operations
 * - React Router for URL parameters
 * - React i18n for internationalization
 * - React Toastify for notifications
 * - Local storage utilities for user session data
 *
 * @example
 * ```tsx
 * // Used in organization routes
 * <Posts />
 * ```
 */

import { useQuery } from '@apollo/client';
import {
  ORGANIZATION_PINNED_POST_LIST,
  ORGANIZATION_POST_BY_ID,
} from 'GraphQl/Queries/OrganizationQueries';
import { ORGANIZATION_POST_LIST_WITH_VOTES } from 'GraphQl/Queries/Queries';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import {
  InterfaceOrganizationPostListData,
  InterfacePost,
  InterfacePostEdge,
} from 'types/Post/interface';
import useLocalStorage from 'utils/useLocalstorage';
import { useTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import { Add } from '@mui/icons-material';
import Button from 'shared-components/Button';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import PageHeader from 'shared-components/Navbar/Navbar';
import PinnedPostsLayout from 'shared-components/pinnedPosts/pinnedPostsLayout';
import PostCard from 'shared-components/postCard/PostCard';
import styles from './posts.module.css';
import { Box, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
import CreatePostModal from 'shared-components/posts/createPostModal/createPostModal';
import PostViewModal from 'shared-components/PostViewModal/PostViewModal';
import { formatPostForCard } from './helperFunctions';

export default function PostsPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'posts' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<InterfacePost[]>([]);
  const { orgId: currentUrl } = useParams();
  const [sortingOption, setSortingOption] = useState('None');
  const [allPosts, setAllPosts] = useState<InterfacePost[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const first = 6;
  const createPostModal = useModalState();
  const postViewModal = useModalState();
  const [selectedViewPost, setSelectedViewPost] =
    useState<InterfacePost | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { getItem } = useLocalStorage();
  // i18n-ignore-next-line
  const userId = getItem<string>('userId') ?? getItem<string>('id') ?? null;
  const [searchParams] = useSearchParams();

  const handleStoryClick = (post: InterfacePost) => {
    setSelectedViewPost(post);
    postViewModal.open();
  };

  const handleClosePostViewModal = () => {
    postViewModal.close();
    setSelectedViewPost(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('previewPostID');
    const query = params.toString();
    // i18n-ignore-next-line
    const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  const {
    data: orgPostListData,
    loading: orgPostListLoading,
    error: orgPostListError,
    refetch,
    fetchMore,
  } = useQuery<InterfaceOrganizationPostListData>(
    ORGANIZATION_POST_LIST_WITH_VOTES,
    {
      skip: !currentUrl || !userId,
      variables: {
        input: { id: currentUrl as string },
        userId: userId,
        after: null,
        before: null,
        first: first,
        last: null,
      },
    },
  );

  const {
    data: orgPinnedPostListData,
    loading: orgPinnedPostListLoading,
    error: orgPinnedPostListError,
  } = useQuery<InterfaceOrganizationPostListData>(
    ORGANIZATION_PINNED_POST_LIST,
    {
      skip: !currentUrl || !userId,
      variables: {
        input: { id: currentUrl as string },
        first: 10,
        last: null,
        userId: userId,
      },
    },
  );

  const {
    data: previewPostData,
    loading: previewPostLoading,
    error: previewPostError,
  } = useQuery<{ post: InterfacePost }>(ORGANIZATION_POST_BY_ID, {
    skip: !searchParams.get('previewPostID') || !userId,
    variables: {
      postId: searchParams.get('previewPostID') as string,
      userId: userId,
    },
  });

  // Initialize posts from query data
  useEffect(() => {
    if (orgPostListData?.organization?.posts?.edges) {
      const posts = orgPostListData.organization.posts.edges.map(
        (edge: InterfacePostEdge) => edge.node,
      );
      setAllPosts(posts);
      setHasMore(
        orgPostListData.organization.posts.pageInfo?.hasNextPage ?? false,
      );
      setAfter(orgPostListData.organization.posts.pageInfo?.endCursor ?? null);
    }
  }, [orgPostListData]);

  // Handle error toasts
  useEffect(() => {
    if (orgPostListError) {
      NotificationToast.error(t('errorLoadingPosts'));
    }
  }, [orgPostListError, t]);

  useEffect(() => {
    if (orgPinnedPostListError)
      NotificationToast.error(t('pinnedPostsLoadError'));
  }, [orgPinnedPostListError, t]);

  useEffect(() => {
    if (previewPostError) {
      NotificationToast.error(t('errorLoadingPreviewPost'));
    }
  }, [previewPostError, t]);

  useEffect(() => {
    const previewPostID = searchParams.get('previewPostID');
    if (previewPostID && previewPostData?.post) {
      setSelectedViewPost(previewPostData.post);
      postViewModal.open();
    }
  }, [searchParams, previewPostData]);

  // Infinite scroll - load more posts
  const loadMorePosts = useCallback((): void => {
    if (!currentUrl || !userId) return;
    if (!hasMore || sortingOption !== 'None') return;
    if (isFetchingMore) return; // Guard against concurrent requests

    setIsFetchingMore(true);

    fetchMore({
      variables: {
        input: { id: currentUrl as string },
        userId: userId,
        after: after,
        before: null,
        first: first,
        last: null,
      },
      updateQuery: (
        prevResult: InterfaceOrganizationPostListData,
        {
          fetchMoreResult,
        }: { fetchMoreResult?: InterfaceOrganizationPostListData },
      ) => {
        if (!fetchMoreResult?.organization?.posts?.edges) {
          return prevResult;
        }

        const newEdges = fetchMoreResult.organization.posts.edges;
        const pageInfo = fetchMoreResult.organization.posts.pageInfo;

        // Merge the new posts with existing ones
        return {
          organization: {
            ...prevResult.organization,
            posts: {
              ...prevResult.organization?.posts,
              edges: [
                ...(prevResult.organization?.posts?.edges ?? []),
                ...newEdges,
              ],
              pageInfo,
            },
          },
        };
      },
    })
      .then((res) => {
        const pageInfo = res.data?.organization?.posts?.pageInfo;
        setHasMore(pageInfo?.hasNextPage ?? false);
        setAfter(pageInfo?.endCursor ?? null);
        setIsFetchingMore(false);
      })
      .catch(() => {
        NotificationToast.error(t('loadMorePostsError'));
        setIsFetchingMore(false);
      });
  }, [
    hasMore,
    sortingOption,
    fetchMore,
    currentUrl,
    userId,
    after,
    first,
    isFetchingMore,
    setIsFetchingMore,
  ]);

  const handleSearch = (term: string): void => {
    setSearchTerm(term);

    if (!term.trim()) {
      setIsFiltering(false);
      setFilteredPosts([]);
      return;
    }

    setIsFiltering(true);
    const filtered = allPosts.filter((post: InterfacePost) =>
      post.caption?.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredPosts(filtered);
  };

  const handleSorting = (option: string | number): void => {
    setSortingOption(option as string);
    if (option !== 'None') {
      setHasMore(false);
    } else if (orgPostListData?.organization?.posts?.pageInfo?.hasNextPage) {
      setHasMore(true);
    }
  };

  // Derive postsToDisplay from allPosts with sorting and filtering
  const postsToDisplay = useMemo(() => {
    let posts = isFiltering ? filteredPosts : allPosts;

    // Apply sorting if not 'None'
    if (sortingOption !== 'None' && posts.length > 0) {
      // Precompute timestamps to avoid duplicate Date creation
      const postsWithTimestamps = posts.map((post) => {
        const time = new Date(post.createdAt).getTime();
        return {
          post,
          timestamp: Number.isFinite(time) ? time : 0,
        };
      });

      postsWithTimestamps.sort((a, b) =>
        sortingOption === 'oldest'
          ? a.timestamp - b.timestamp
          : b.timestamp - a.timestamp,
      );

      posts = postsWithTimestamps.map(({ post }) => post);
    }

    return posts;
  }, [allPosts, filteredPosts, isFiltering, sortingOption]);

  if (orgPostListLoading || orgPinnedPostListLoading || previewPostLoading) {
    return (
      <LoadingState
        isLoading={
          orgPostListLoading || orgPinnedPostListLoading || previewPostLoading
        }
        variant="spinner"
      >
        <div />
      </LoadingState>
    );
  }

  const pinnedPosts =
    orgPinnedPostListData?.organization?.pinnedPosts?.edges ?? [];

  return (
    <>
      <Row>
        <div className={styles.mainpagerightOrgPost}>
          <PageHeader
            search={{
              placeholder: t('searchTitle'),
              onSearch: handleSearch,
              inputTestId: 'searchByName',
            }}
            sorting={[
              {
                title: t('sortPost'),
                options: [
                  { label: t('latest'), value: 'latest' },
                  { label: t('oldest'), value: 'oldest' },
                  { label: t('none'), value: 'None' },
                ],
                selected: sortingOption,
                onChange: handleSorting,
                testIdPrefix: 'sortpost',
              },
            ]}
            showEventTypeFilter={false}
            actions={
              <Button
                variant="success"
                onClick={createPostModal.open}
                disabled={!userId}
                data-testid="createPostModalBtn"
                data-cy="createPostModalBtn"
                className={`${styles.createButton}`}
              >
                <Add />
                {t('createPost')}
              </Button>
            }
          />

          <div className={`row ${styles.list_box}`}>
            <div
              data-testid="posts-renderer"
              data-loading={String(orgPostListLoading)}
              data-is-filtering={String(isFiltering)}
              data-sorting-option={sortingOption}
              id="posts-scroll-container"
            >
              {orgPostListError && (
                <div data-testid="not-found">{t('errorLoadingPosts')}</div>
              )}

              {/* Pinned Posts Carousel */}
              {pinnedPosts.length > 0 && !isFiltering && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    {t('pinnedPosts')}
                  </Typography>
                  <PinnedPostsLayout
                    pinnedPosts={pinnedPosts}
                    onStoryClick={handleStoryClick}
                  />
                </Box>
              )}

              {/* Search Results Message */}
              {isFiltering && filteredPosts.length === 0 && searchTerm && (
                <Box sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {t('noPostsFoundMatching', { term: searchTerm })}
                  </Typography>
                </Box>
              )}

              {/* Posts List with Infinite Scroll */}
              {isFiltering ? (
                // Display filtered posts without infinite scroll
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                  }}
                >
                  {postsToDisplay.map((post) => (
                    <PostCard
                      key={post.id}
                      {...formatPostForCard(post, t, refetch)}
                    />
                  ))}
                </Box>
              ) : (
                // Infinite scroll for regular posts
                <InfiniteScroll
                  dataLength={postsToDisplay.length}
                  next={loadMorePosts}
                  hasMore={hasMore && sortingOption === 'None'}
                  loader={<InfiniteScrollLoader />}
                  endMessage={
                    postsToDisplay.length > 0 && (
                      <Box sx={{ py: 2 }}>
                        <Typography color="text.secondary">
                          {t('noMorePosts')}
                        </Typography>
                      </Box>
                    )
                  }
                  scrollThreshold={0.8}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                    }}
                  >
                    {postsToDisplay.map((post) => (
                      <PostCard
                        key={post.id}
                        {...formatPostForCard(post, t, refetch)}
                      />
                    ))}
                  </Box>
                </InfiniteScroll>
              )}

              {/* Empty State */}
              {postsToDisplay.length === 0 &&
                !orgPostListLoading &&
                !isFiltering && (
                  <Box sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {t('noPosts')}
                    </Typography>
                  </Box>
                )}
            </div>
          </div>
        </div>
      </Row>
      {userId && (
        <div>
          <CreatePostModal
            show={createPostModal.isOpen}
            onHide={createPostModal.close}
            refetch={refetch}
            orgId={currentUrl}
            type="create"
          />
        </div>
      )}

      {/* Pinned Post Modal */}
      <PostViewModal
        show={postViewModal.isOpen}
        onHide={handleClosePostViewModal}
        post={selectedViewPost}
        refetch={refetch}
      />
    </>
  );
}
