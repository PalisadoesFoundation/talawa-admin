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

  // The generateUniqueObjectName function properly handles both image and video URLs
  const generateUniqueObjectName = (
    postId: string,
    fileUrl: string,
    fileType: string
  ): string => {
    // Extract file extension from URL or use default based on type
    const extension = fileUrl.split('.').pop()?.toLowerCase() || 
      (fileType === 'image/jpeg' ? 'jpg' : 
       fileType === 'video/mp4' ? 'mp4' : 'bin');
    
    // Generate a timestamp-based unique identifier
    const timestamp = new Date().getTime();
    
    // Create format: posts/{postId}/{timestamp}-{last-part-of-url}.{extension}
    const urlLastPart = fileUrl.split('/').pop()?.split('.')[0] || 'file';
    return `posts/${postId}/${timestamp}-${urlLastPart}.${extension}`;
  };

  const createAttachments = (
    post: InterfacePost,
    createdAt: Date,
  ): {
    id: string;
    postId: string;
    name: string;
    objectName: string; // Add objectName property
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
              // Generate a proper objectName for MinIO instead of using raw URL
              objectName: generateUniqueObjectName(post.id, post.imageUrl, 'image/jpeg'),
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
              // For videos, we already use the proper MinIO object naming pattern:
              objectName: generateUniqueObjectName(post.id, post.videoUrl, 'video/mp4'),
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
      <div data-testid="post-caption" key={post.id}>
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
