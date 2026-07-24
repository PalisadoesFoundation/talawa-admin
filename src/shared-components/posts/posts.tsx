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
import Add from '@mui/icons-material/Add';
import Button from 'shared-components/Button';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import Toolbar from 'shared-components/Toolbar/Toolbar';
import PinnedPostsLayout from 'shared-components/pinnedPosts/pinnedPostsLayout';
import PostCard from 'shared-components/postCard/PostCard';
import styles from './posts.module.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  const [layout, setLayout] = useState<'feed' | 'grid'>('feed');
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

  /**
   * Helper: get author initials from name string.
   */
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] ?? '').toUpperCase();
  };

  /**
   * Helper: format a post date for display.
   */
  const formatTimestamp = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return (
        d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }) +
        ' at ' +
        d.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    } catch {
      return '';
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            {t('title')} <span className="count-badge">{allPosts.length}</span>
          </h1>
          <p className="page-subtitle">{t('searchTitle')}</p>
        </div>
        <div className="page-header-actions">
          <Button
            onClick={createPostModal.open}
            disabled={!userId}
            data-testid="createPostModalBtn"
            data-cy="createPostModalBtn"
            className="btn btn-primary"
          >
            + {t('createPost')}
          </Button>
        </div>
      </div>

      <div className="toolbar">
        <div className="topbar-spacer">
          <Toolbar
            search={{
              placeholder: t('searchTitle'),
              onSearch: handleSearch,
              inputTestId: 'searchByName',
            }}
            filters={[
              {
                type: 'sort',
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
          />
        </div>
        <div className={styles.layoutToggle}>
          <button
            className={`${styles.layoutBtn} ${layout === 'feed' ? styles.layoutBtnActive : ''}`}
            onClick={() => setLayout('feed')}
            title="Feed view"
            aria-label="Feed view"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <button
            className={`${styles.layoutBtn} ${layout === 'grid' ? styles.layoutBtnActive : ''}`}
            onClick={() => setLayout('grid')}
            title="Grid view"
            aria-label="Grid view"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>
      </div>

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

        {/* Search Results Message */}
        {isFiltering && filteredPosts.length === 0 && searchTerm && (
          <div className="empty-state">
            <p className="empty-state-text">
              {t('noPostsFoundMatching', { term: searchTerm })}
            </p>
          </div>
        )}

        {/* Post Feed */}
        {isFiltering ? (
          <div
            className={
              layout === 'grid'
                ? 'post-feed post-feed-grid'
                : 'post-feed post-feed-single'
            }
          >
            {postsToDisplay.map((post) => {
              const authorName = post.creator?.name ?? 'Unknown User';
              const initials = getInitials(authorName);
              const isPinned = !!post.pinnedAt;
              const hasImage = !!post.attachmentURL;
              return (
                <div
                  className="post-card"
                  key={post.id}
                  data-testid={`post-card-${post.id}`}
                >
                  <div className="post-header">
                    <div className="post-avatar">{initials}</div>
                    <div>
                      <div className="post-author-name">{authorName}</div>
                      <div className="post-timestamp">
                        {formatTimestamp(post.createdAt)}
                      </div>
                    </div>
                    {isPinned && (
                      <span className="post-pin-badge badge badge-orange">
                        {'\uD83D\uDCCC'} {t('pinnedPosts')}
                      </span>
                    )}
                  </div>
                  <div className="post-content">{post.caption ?? ''}</div>
                  {hasImage && (
                    <div className="post-image-container">
                      <img
                        src={post.attachmentURL}
                        alt="Post attachment"
                        className="post-image"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                  <div className="post-footer">
                    <div className="post-action">
                      <span className="post-action-icon">{'\u2764'}</span>{' '}
                      {post.upVotesCount ?? 0} likes
                    </div>
                    <div className="post-action">
                      <span className="post-action-icon">{'\uD83D\uDCAC'}</span>{' '}
                      {post.commentsCount ?? 0} comments
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
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
            <div
              className={
                layout === 'grid'
                  ? 'post-feed post-feed-grid'
                  : 'post-feed post-feed-single'
              }
            >
              {postsToDisplay.map((post) => {
                const authorName = post.creator?.name ?? 'Unknown User';
                const initials = getInitials(authorName);
                const isPinned = !!post.pinnedAt;
                const hasImage = !!post.attachmentURL;
                return (
                  <div
                    className="post-card"
                    key={post.id}
                    data-testid={`post-card-${post.id}`}
                  >
                    <div className="post-header">
                      <div className="post-avatar">{initials}</div>
                      <div>
                        <div className="post-author-name">{authorName}</div>
                        <div className="post-timestamp">
                          {formatTimestamp(post.createdAt)}
                        </div>
                      </div>
                      {isPinned && (
                        <span className="post-pin-badge badge badge-orange">
                          {'\uD83D\uDCCC'} {t('pinnedPosts')}
                        </span>
                      )}
                    </div>
                    <div className="post-content">{post.caption ?? ''}</div>
                    {hasImage && (
                      <div className="post-image-container">
                        <img
                          src={post.attachmentURL}
                          alt="Post attachment"
                          className="post-image"
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                    <div className="post-footer">
                      <div className="post-action">
                        <span className="post-action-icon">{'\u2764'}</span>{' '}
                        {post.upVotesCount ?? 0} likes
                      </div>
                      <div className="post-action">
                        <span className="post-action-icon">
                          {'\uD83D\uDCAC'}
                        </span>{' '}
                        {post.commentsCount ?? 0} comments
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}

        {/* Empty State */}
        {postsToDisplay.length === 0 && !orgPostListLoading && !isFiltering && (
          <div className="empty-state">
            <p className="empty-state-text">{t('noPosts')}</p>
          </div>
        )}
      </div>

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
