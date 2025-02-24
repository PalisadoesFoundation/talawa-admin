import React from 'react';
import type { ApolloError } from '@apollo/client';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import type {
  InterfacePost,
  InterfacePostEdge,
} from '../../types/Post/interface';

/**
 * PostsRenderer component renders a list of posts based on various conditions.
 *
 * Props:
 * - loading: boolean - Indicates if the data is currently loading.
 * - error: ApolloError | undefined - Error object if the data fetching failed.
 * - data: InterfaceOrganizationData - The data containing posts information.
 * - isFiltering: boolean - Indicates if a filter is applied to the posts.
 * - searchTerm: string - The term used to filter the posts by caption.
 * - sortingOption: string - The sorting option applied to the posts.
 * - displayPosts: InterfacePost[] - The list of posts to display after sorting/filtering.
 *
 * Returns:
 * - JSX.Element | null - The rendered posts or appropriate messages based on conditions.
 */

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
  error: ApolloError | undefined; // Updated to match Apollo's error type
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
  if (loading) return <Loader />;
  if (error) return <div>Error loading posts</div>;

  // Rest of the component remains the same...
  // (Previous implementation of createAttachments, renderPostCard, and rendering logic)

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
      <div data-testid="post-caption">
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
        {filtered.map((edge: InterfacePostEdge) => renderPostCard(edge.node))}
      </>
    );
  }

  if (sortingOption !== 'None') {
    if (!displayPosts.length) {
      return <NotFound title="post" keyPrefix="postNotFound" />;
    }

    return <>{displayPosts.map((post) => renderPostCard(post))}</>;
  }

  if (!data?.organization?.posts?.edges?.length) {
    return <NotFound title="post" keyPrefix="postNotFound" />;
  }

  return (
    <>
      {data.organization.posts.edges
        .map((edge: InterfacePostEdge) => renderPostCard(edge.node))
        .filter(Boolean)}
    </>
  );
};

export default PostsRenderer;
