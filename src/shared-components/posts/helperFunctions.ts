import type { InterfacePost } from 'types/Post/interface';
import { formatDate } from 'utils/dateFormatter';
import type { InterfacePostCard } from 'utils/interfaces';

// translation-check-keyPrefix: posts
/**
 * Formats a post object to match the PostCard component's expected interface.
 *
 * This function transforms a raw post object from the GraphQL API into the format
 * required by the PostCard component, handling missing values with appropriate fallbacks
 * and formatting dates safely.
 *
 * @param post - The raw post object from the API
 * @param t - Translation function for internationalized text
 * @param refetch - Function to refetch posts data, typically from Apollo Client
 *
 * @returns An object formatted to match the InterfacePostCard interface
 *
 * @example
 * ```tsx
 * const formattedPost = formatPostForCard(rawPost, t, refetch);
 * <PostCard {...formattedPost} />
 * ```
 */
export const formatPostForCard = (
  post: InterfacePost,
  t: (key: string) => string,
  refetch: () => Promise<unknown>,
): Omit<InterfacePostCard, 'image' | 'video'> => ({
  id: post.id,
  creator: {
    id: post.creator?.id ?? 'unknown',
    name: post.creator?.name ?? t('unknownUser'),
    avatarURL: post.creator?.avatarURL,
  },
  hasUserVoted: post.hasUserVoted ?? { hasVoted: false, voteType: null },
  postedAt: (() => {
    try {
      return formatDate(post.createdAt);
    } catch {
      return '';
    }
  })(),
  pinnedAt: post.pinnedAt ?? null,
  mimeType: post.attachments?.[0]?.mimeType ?? null,
  attachmentURL: post.attachmentURL ?? null,
  title: post.caption ?? '',
  text: post.caption ?? '',
  body: post.body,
  commentCount: post.commentsCount ?? 0,
  upVoteCount: post.upVotesCount ?? 0,
  downVoteCount: post.downVotesCount ?? 0,
  fetchPosts: refetch,
});
