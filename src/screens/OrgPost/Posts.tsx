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
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import type { InterfacePost, InterfacePostEdge } from 'types/Post/interface';
import PinnedPostsStory from './PinnedPostsStory';
import { Close } from '@mui/icons-material';

interface InterfaceOrganizationData {
  organization?: {
    posts?: {
      edges?: InterfacePostEdge[];
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
}): JSX.Element | null => {
  const [selectedPinnedPost, setSelectedPinnedPost] =
    useState<InterfacePost | null>(null);
  const [showPinnedPostModal, setShowPinnedPostModal] = useState(false);

  if (loading) return <Loader />;
  if (error) return <div data-testid="error-message">Error loading posts</div>;

  const createAttachments = (
    post: InterfacePost,
    createdAt: Date,
  ): {
    id: string;
    postId: string;
    name: string;
    mimeType: string;
    createdAt: Date;
  }[] => {
    return [
      ...(post.imageUrl
        ? [
            {
              id: `${post.id}-image`,
              postId: post.id,
              name: post.imageUrl,
              mimeType: 'image/jpeg',
              createdAt,
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
              createdAt,
            },
          ]
        : []),
    ];
  };

  const renderPostCard = (post: InterfacePost): JSX.Element | null => {
    if (!post || !post.id) return null;
    const createdAt = new Date(post.createdAt);
    const attachments = createAttachments(post, createdAt);

    return (
      <div data-testid="postCardContainer" key={post.id}>
        <OrgPostCard
          key={post.id}
          post={{
            id: post.id,
            caption: post.caption || null,
            createdAt,
            pinnedAt: post.pinnedAt ? new Date(post.pinnedAt) : null,
            creatorId: post.creator?.id || null,
            attachments,
          }}
        />
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
          .map((edge: InterfacePostEdge) => renderPostCard(edge.node))
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
