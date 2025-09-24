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
import { Modal, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import type { InterfacePost, InterfacePostEdge } from 'types/Post/interface';
import PinnedPostsStory from './PinnedPostsStory';

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
  isFiltering: boolean;
  searchTerm: string;
  sortingOption: string;
  displayPosts: InterfacePost[];
}

const PostsRenderer: React.FC<InterfacePostsRenderer> = ({
  loading,
  error,
  data,
  isFiltering,
  searchTerm,
  sortingOption,
  displayPosts,
}): JSX.Element | null => {
  const [selectedPinnedPost, setSelectedPinnedPost] =
    useState<InterfacePost | null>(null);
  const [showPinnedPostModal, setShowPinnedPostModal] = useState(false);

  if (loading) return <Loader />;
  if (error) return <div>Error loading posts</div>;

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
            caption: post.caption,
            createdAt,
            pinnedAt: post.pinned ? new Date() : null,
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

  // Get all posts from the appropriate data source
  let allPosts: InterfacePost[] = [];

  if (isFiltering && data?.postsByOrganization) {
    allPosts = data.postsByOrganization;
  } else if (data?.organization?.posts?.edges) {
    allPosts = data.organization.posts.edges.map(
      (edge: InterfacePostEdge) => edge.node,
    );
  }

  // Filter pinned posts
  const pinnedPosts = allPosts.filter((post) => post.pinned || post.pinnedAt);

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
        {/* Pinned Posts Stories */}
        <PinnedPostsStory
          pinnedPosts={pinnedPosts}
          onStoryClick={handleStoryClick}
        />

        <div
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

        {/* Pinned Post Modal */}
        {selectedPinnedPost && (
          <Modal
            open={showPinnedPostModal}
            onClose={handleClosePinnedModal}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(3px)',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                maxHeight: '90vh',
                overflowY: 'auto',
                outline: 'none',
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <IconButton
                onClick={handleClosePinnedModal}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Close />
              </IconButton>

              {/* Render the pinned post */}
              {renderPostCard(selectedPinnedPost)}
            </Box>
          </Modal>
        )}
      </>
    );
  }

  if (sortingOption !== 'None') {
    if (!displayPosts.length) {
      return <NotFound title="post" keyPrefix="postNotFound" />;
    }

    return (
      <>
        {/* Pinned Posts Stories */}
        <PinnedPostsStory
          pinnedPosts={pinnedPosts}
          onStoryClick={handleStoryClick}
        />

        <div data-testid="dropdown">
          {displayPosts.map((post) => renderPostCard(post))}
        </div>

        {/* Pinned Post Modal */}
        {selectedPinnedPost && (
          <Modal
            open={showPinnedPostModal}
            onClose={handleClosePinnedModal}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(3px)',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                maxHeight: '90vh',
                overflowY: 'auto',
                outline: 'none',
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <IconButton
                onClick={handleClosePinnedModal}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Close />
              </IconButton>

              {/* Render the pinned post */}
              {renderPostCard(selectedPinnedPost)}
            </Box>
          </Modal>
        )}
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
        pinnedPosts={pinnedPosts}
        onStoryClick={handleStoryClick}
      />

      {/* Regular Posts */}
      {data.organization.posts.edges
        .map((edge: InterfacePostEdge) => renderPostCard(edge.node))
        .filter(Boolean)}

      {/* Pinned Post Modal */}
      {selectedPinnedPost && (
        <Modal
          open={showPinnedPostModal}
          onClose={handleClosePinnedModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(3px)',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflowY: 'auto',
              outline: 'none',
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <IconButton
              onClick={handleClosePinnedModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                },
              }}
            >
              <Close />
            </IconButton>

            {/* Render the pinned post */}
            {renderPostCard(selectedPinnedPost)}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PostsRenderer;
