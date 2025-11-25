/**
 * A React functional component that renders a list of posts based on the provided props.
 * Handles loading, error states, filtering, and sorting of posts.
 * Now includes Instagram-style stories for pinned posts.
 *
 * @component
 * @param {InterfacePostsRenderer} props - The props for the component.
 * @param {boolean} props.loading - Indicates whether the data is still loading.
 * @param {ApolloError | undefined} props.error - The error object from Apollo Client, if any.
 * @param {InterfaceOrganizationData} props.data - The data containing posts and organization details.
 * @param {boolean} props.isFiltering - Indicates whether the posts are being filtered.
 * @param {string} props.searchTerm - The search term used for filtering posts.
 * @param {string} props.sortingOption - The sorting option applied to the posts.
 * @param {InterfacePost[]} props.displayPosts - The list of posts to display when sorting is applied.
 *
 * @returns {JSX.Element | null} A JSX element rendering the posts or appropriate fallback UI.
 */
import React, { useState } from 'react';
import type { ApolloError } from '@apollo/client';
import { Modal, Button } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import PostCard from 'shared-components/postCard/PostCard';
import type { InterfacePost, InterfacePostEdge } from 'types/Post/interface';
import type { PostNode } from 'types/Post/type';
import type { InterfacePostCard } from 'utils/interfaces';
import PinnedPostsStory from './PinnedPostsStory';
import { Close } from '@mui/icons-material';

interface InterfaceOrganizationData {
  organization?: {
    posts?: {
      edges?: {
        node: PostNode;
        cursor: string;
      }[];
    };
  };
  postsByOrganization?: InterfacePost[];
}

// Define interface for props with proper types
interface InterfacePostsRenderer {
  loading: boolean;
  error: ApolloError | undefined;
  data: InterfaceOrganizationData;
  pinnedPostData: InterfacePostEdge[] | undefined;
  isFiltering: boolean;
  searchTerm: string;
  sortingOption: string;
  displayPosts: InterfacePost[];
  refetch?: () => void;
}

const PostsRenderer: React.FC<InterfacePostsRenderer> = ({
  loading,
  error,
  data,
  pinnedPostData,
  isFiltering,
  searchTerm,
  sortingOption,
  displayPosts,
  refetch,
}): JSX.Element | null => {
  const [selectedPinnedPost, setSelectedPinnedPost] =
    useState<InterfacePost | null>(null);
  const [showPinnedPostModal, setShowPinnedPostModal] = useState(false);

  if (loading) return <Loader />;
  if (error) return <div data-testid="error-message">Error loading posts</div>;

  const renderPostCard = (
    post: InterfacePost | PostNode,
  ): JSX.Element | null => {
    if (!post || !post.id) return null;

    // Get image and video from attachments for PostNode, or directly from InterfacePost
    let imageUrl = null;
    let videoUrl = null;

    const postNode = post as PostNode;
    const imageAttachment = postNode.attachments?.find((att) =>
      att.mimeType.startsWith('image/'),
    );
    const videoAttachment = postNode.attachments?.find((att) =>
      att.mimeType.startsWith('video/'),
    );
    imageUrl = imageAttachment?.name || null;
    videoUrl = videoAttachment?.name || null;

    // Convert to InterfacePostCard format expected by the shared PostCard
    const cardProps: InterfacePostCard = {
      id: post.id,
      creator: {
        id: post.creator?.id || '',
        name: post.creator?.name || 'Unknown',
        avatarURL: post.creator?.avatarURL || null,
      },
      hasUserVoted: (post as PostNode).hasUserVoted,
      postedAt: new Date(post.createdAt).toLocaleDateString(),
      pinnedAt: post.pinnedAt || null,
      image: imageUrl,
      video: videoUrl,
      title: post.caption || '',
      text: '',
      commentCount: (post as PostNode).commentsCount,
      upVoteCount: (post as PostNode).upVotesCount,
      downVoteCount: (post as PostNode).downVotesCount,
      fetchPosts: refetch || (() => window.location.reload()),
    };

    return (
      <div data-testid="postCardContainer" key={post.id}>
        <PostCard {...cardProps} />
      </div>
    );
  };

  const handleStoryClick = (post: InterfacePost) => {
    setSelectedPinnedPost(post);
    setShowPinnedPostModal(true);
  };

  const handleClosePinnedModal = () => {
    setShowPinnedPostModal(false);
    setSelectedPinnedPost(null);
  };

  if (isFiltering) {
    if (!data?.postsByOrganization || data.postsByOrganization.length === 0) {
      return <NotFound title="post" keyPrefix="postNotFound" />;
    }

    const filtered = data.postsByOrganization
      .filter(
        (post: InterfacePost) =>
          post &&
          post.caption &&
          post.caption.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((post: InterfacePost) => ({
        node: post,
        cursor: '',
      })) as InterfacePostEdge[];

    if (filtered.length === 0) {
      return <NotFound title="post" keyPrefix="postNotFound" />;
    }

    return (
      <>
        <div
          data-testid="filtered-posts-container"
          style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          {/* Filtered Posts */}
          {filtered.map((edge: InterfacePostEdge) => renderPostCard(edge.node))}
        </div>
      </>
    );
  }

  if (sortingOption !== 'None') {
    if (!displayPosts.length) {
      return <NotFound title="post" keyPrefix="postNotFound" />;
    }

    return (
      <>
        <div data-testid="dropdown">
          {displayPosts.map((post) => renderPostCard(post))}
        </div>
      </>
    );
  }

  if (!data?.organization?.posts?.edges?.length) {
    return <NotFound title="post" keyPrefix="postNotFound" />;
  }

  return (
    <>
      {/* Pinned Posts Stories */}
      <PinnedPostsStory
        pinnedPosts={pinnedPostData || []}
        onStoryClick={handleStoryClick}
        data-testid="story-pinned-post-1"
      />

      {/* Regular Posts */}
      <div data-testid="regular-posts-container">
        {data.organization.posts.edges
          .map((edge) => renderPostCard(edge.node))
          .filter(Boolean)}
      </div>

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
            {renderPostCard(selectedPinnedPost)}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default PostsRenderer;
