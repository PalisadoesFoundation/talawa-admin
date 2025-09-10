/**
 * A React functional component that renders a list of posts based on the provided props.
 * Handles loading, error states, filtering, and sorting of posts.
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
 *
 * @remarks
 * - Displays a loader when `loading` is true.
 * - Shows an error message if `error` is present.
 * - Filters posts based on `searchTerm` when `isFiltering` is true.
 * - Sorts and displays posts based on `sortingOption` when applicable.
 * - Renders a "Not Found" component if no posts are available after filtering or sorting.
 *
 * @example
 * ```tsx
 * <PostsRenderer
 *   loading={false}
 *   error={undefined}
 *   data={data}
 *   isFiltering={true}
 *   searchTerm="example"
 *   sortingOption="Date"
 *   displayPosts={[]}
 * />
 * ```
 */
import React from 'react';
import type { ApolloError } from '@apollo/client';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import OrgPostCard from 'components/OrgPostCard/OrgPostCard';
import type { InterfacePost, InterfacePostEdge } from 'types/Post/interface';

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

    return (
      <div data-testid="dropdown">
        {displayPosts.map((post) => renderPostCard(post))}
      </div>
    );
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
