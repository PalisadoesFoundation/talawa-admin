import type { IPostNode } from './OrgPostMocks.types';

export const enrichPostNode = (post: IPostNode) => {
  const creator = {
    __typename: 'User',
    id: post.creator?.id || 'creator-id',
    firstName: post.creator?.firstName || 'Creator',
    lastName: post.creator?.lastName || 'Name',
    name:
      post.creator?.name ||
      (post.creator?.firstName
        ? `${post.creator.firstName} ${post.creator.lastName}`
        : 'Creator Name'),
    avatarURL: post.creator?.avatarURL || null,
    emailAddress: post.creator?.emailAddress || 'creator@example.com',
  };

  return {
    __typename: 'Post',
    id: post.id ?? post._id ?? `post-${Math.random()}`,
    caption: post.caption ?? 'Untitled',
    createdAt: post.createdAt ?? new Date().toISOString(),
    updatedAt: post.updatedAt ?? post.createdAt ?? new Date().toISOString(),
    pinnedAt: post.pinnedAt ?? null,
    pinned: post.pinned ?? false,
    hasUserVoted: post.hasUserVoted ?? {
      __typename: 'VoteStatus',
      hasVoted: false,
      voteType: 'none',
    },
    attachments: post.attachments
      ? post.attachments.map((a: any) => ({ ...a, __typename: 'FileMetadata' }))
      : [],
    imageUrl: post.imageUrl ?? null,
    videoUrl: post.videoUrl ?? null,
    creator,
    postsCount: post.postsCount ?? 0,
    commentsCount: post.commentsCount ?? 0,
    upVotesCount: post.upVotesCount ?? 0,
    downVotesCount: post.downVotesCount ?? 0,
    comments: post.comments ?? [],
  };
};
