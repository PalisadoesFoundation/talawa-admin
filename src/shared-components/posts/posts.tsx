import { useQuery } from '@apollo/client';
import { ORGANIZATION_PINNED_POST_LIST } from 'GraphQl/Queries/OrganizationQueries';
import {
  GET_POSTS_BY_ORG,
  ORGANIZATION_POST_LIST_WITH_VOTES,
} from 'GraphQl/Queries/Queries';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import {
  InterfaceOrganizationPostListData,
  InterfacePost,
  InterfacePostEdge,
} from 'types/Post/interface';
import useLocalStorage from 'utils/useLocalstorage';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { Add, Close } from '@mui/icons-material';
import Loader from 'components/Loader/Loader';
import PageHeader from 'shared-components/Navbar/Navbar';
import CreatePostModal from 'screens/OrgPost/CreatePostModal';
import PinnedPostsLayout from 'shared-components/pinnedPosts/pinnedPostsLayout';
import PostCard from 'shared-components/postCard/PostCard';
import styles from 'style/app-fixed.module.css';
import { Box, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import { Modal } from 'react-bootstrap';

export default function PostsPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'posts' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<InterfacePost[]>([]);
  const { orgId: currentUrl } = useParams();
  const [sortingOption, setSortingOption] = useState('None');
  const [allPosts, setAllPosts] = useState<InterfacePost[]>([]);
  const [after, setAfter] = useState<string | null | undefined>(null);
  const [first] = useState<number | null>(6);
  const [postModalIsOpen, setPostModalIsOpen] = useState(false);
  const [selectedPinnedPost, setSelectedPinnedPost] =
    useState<InterfacePost | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { getItem } = useLocalStorage();
  const userId = getItem('id');
  const [showPinnedPostModal, setShowPinnedPostModal] = useState(false);

  const showCreatePostModal = (): void => {
    setPostModalIsOpen(true);
  };

  const hideCreatePostModal = (): void => {
    setPostModalIsOpen(false);
  };

  const handleStoryClick = (post: InterfacePost) => {
    setSelectedPinnedPost(post);
    setShowPinnedPostModal(true);
  };

  const handleClosePinnedModal = () => {
    setShowPinnedPostModal(false);
    setSelectedPinnedPost(null);
  };

  const {
    data,
    loading,
    error,
    refetch: refetchPosts,
  } = useQuery(GET_POSTS_BY_ORG, {
    variables: { input: { organizationId: currentUrl } },
    fetchPolicy: 'network-only',
  });

  const {
    data: orgPostListData,
    loading: orgPostListLoading,
    error: orgPostListError,
    refetch,
    fetchMore,
  } = useQuery<InterfaceOrganizationPostListData>(
    ORGANIZATION_POST_LIST_WITH_VOTES,
    {
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
      variables: {
        input: { id: currentUrl as string },
        first: 10,
        last: null,
        userId: userId,
      },
    },
  );

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
    if (orgPostListError) toast.error('Organization post list error');
  }, [orgPostListError]);

  useEffect(() => {
    if (orgPinnedPostListError) toast.error(t('pinnedPostsLoadError'));
  }, [orgPinnedPostListError, t]);

  // Sort posts when data or sorting option changes
  useEffect(() => {
    if (sortingOption !== 'None' && data?.postsByOrganization) {
      const posts = [...data.postsByOrganization];
      const sorted = posts.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortingOption === 'oldest' ? dateA - dateB : dateB - dateA;
      });
      setAllPosts(sorted);
      setHasMore(false); // When sorting, we have all posts loaded
    }
  }, [data, sortingOption]);

  // Infinite scroll - load more posts
  const loadMorePosts = useCallback((): void => {
    if (!hasMore || sortingOption !== 'None') return;

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

        // Update cursor and hasMore state
        setHasMore(pageInfo?.hasNextPage ?? false);
        setAfter(pageInfo?.endCursor ?? null);

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
    }).catch(() => {
      toast.error('Error loading more posts');
    });
  }, [hasMore, sortingOption, fetchMore, currentUrl, userId, after, first]);

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
            post.caption?.toLowerCase().includes(term.toLowerCase()),
        );
        setFilteredPosts(filtered);
      }
    } catch {
      toast.error('Error searching posts');
      setIsFiltering(false);
    }
  };

  const handleSorting = (option: string | number): void => {
    setSortingOption(option as string);

    if (option === 'None') {
      // Reset to paginated data
      refetch();
      return;
    }

    if (!data?.postsByOrganization) {
      return;
    }

    const posts = [...data.postsByOrganization];
    const sorted = posts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return option === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    setAllPosts(sorted);
    setHasMore(false);
  };

  const handleRefetch = async (): Promise<void> => {
    await refetch();
    await refetchPosts({ input: { organizationId: currentUrl } });
  };

  // Helper function to format post data for PostCard
  const formatPostForCard = (post: InterfacePost) => ({
    id: post.id,
    creator: {
      id: post.creator?.id ?? 'unknown',
      name: post.creator?.name ?? 'Unknown User',
      avatarURL: post.creator?.avatarURL,
    },
    hasUserVoted: post.hasUserVoted,
    postedAt: new Date(post.createdAt).toLocaleDateString(),
    pinnedAt: post.pinnedAt ?? null,
    image: post.imageUrl ?? post.attachments?.[0]?.url ?? null,
    video: post.videoUrl ?? null,
    title: post.caption ?? '',
    text: post.caption ?? '',
    commentCount: post.commentsCount,
    upVoteCount: post.upVotesCount,
    downVoteCount: post.downVotesCount,
    fetchPosts: handleRefetch,
  });

  if (orgPostListLoading || orgPinnedPostListLoading) {
    return <Loader />;
  }

  const pinnedPosts =
    orgPinnedPostListData?.organization?.pinnedPosts?.edges ?? [];
  const postsToDisplay = isFiltering ? filteredPosts : allPosts;

  return (
    <>
      <Row className={styles.head} style={{ minHeight: '100vh' }}>
        <div className={styles.mainpagerightOrgPost}>
          <PageHeader
            search={{
              placeholder: t('searchTitle'),
              onSearch: handleSearch,
              inputTestId: 'searchByName',
            }}
            sorting={[
              {
                title: 'Sort Post',
                options: [
                  { label: 'Latest', value: 'latest' },
                  { label: 'Oldest', value: 'oldest' },
                  { label: 'None', value: 'None' },
                ],
                selected: sortingOption,
                onChange: handleSorting,
                testIdPrefix: 'sortpost-toggle',
              },
            ]}
            showEventTypeFilter={false}
            actions={
              <Button
                variant="success"
                onClick={showCreatePostModal}
                data-testid="createPostModalBtn"
                data-cy="createPostModalBtn"
                className={`${styles.createButton} mb-2`}
              >
                <Add sx={{ fontSize: '20px', marginRight: '6px' }} />
                {t('createPost')}
              </Button>
            }
          />

          <div className={`row ${styles.list_box}`}>
            <div
              data-testid="posts-renderer"
              data-loading={String(loading)}
              data-is-filtering={String(isFiltering)}
              data-sorting-option={sortingOption}
              id="posts-scroll-container"
            >
              {error && <div data-testid="not-found">Error loading posts</div>}

              {/* Pinned Posts Carousel */}
              {pinnedPosts.length > 0 && !isFiltering && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
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
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No posts found matching "{searchTerm}"
                  </Typography>
                </Box>
              )}

              {/* Posts List with Infinite Scroll */}
              {isFiltering ? (
                // Display filtered posts without infinite scroll
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} {...formatPostForCard(post)} />
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
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography color="text.secondary">
                          {t('noMorePosts')}
                        </Typography>
                      </Box>
                    )
                  }
                  scrollThreshold={0.8}
                  style={{ overflow: 'visible' }}
                >
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    {postsToDisplay.map((post) => (
                      <PostCard key={post.id} {...formatPostForCard(post)} />
                    ))}
                  </Box>
                </InfiniteScroll>
              )}

              {/* Empty State */}
              {postsToDisplay.length === 0 && !loading && !isFiltering && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">{t('noPosts')}</Typography>
                </Box>
              )}
            </div>
          </div>
        </div>
      </Row>

      <CreatePostModal
        show={postModalIsOpen}
        onHide={hideCreatePostModal}
        refetch={refetch}
        orgId={currentUrl}
      />

      {/* Pinned Post Modal */}
      {selectedPinnedPost && (
        <Modal
          show={showPinnedPostModal}
          onHide={handleClosePinnedModal}
          data-testid="pinned-post-modal"
          centered
          size="lg"
          backdrop="static"
          style={{
            backdropFilter: 'blur(3px)',
          }}
        >
          <Modal.Body
            style={{
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '20px',
              position: 'relative',
            }}
          >
            <Button
              variant="light"
              onClick={handleClosePinnedModal}
              data-testid="close-pinned-post-button"
              className="position-absolute top-0 end-0 m-2 btn-close-custom"
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Close sx={{ fontSize: 20 }} />
            </Button>
            {/* Render the pinned post */}
            <PostCard {...formatPostForCard(selectedPinnedPost)} />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
