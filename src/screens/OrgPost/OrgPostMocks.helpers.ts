export interface IPostCreator {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatarURL?: string | null;
  emailAddress?: string;
}

export interface IPostNode {
  id?: string;
  _id?: string;
  caption?: string;
  createdAt?: string;
  updatedAt?: string;
  pinnedAt?: string | null;
  pinned?: boolean;
  attachments?: unknown[];
  imageUrl?: string | null;
  videoUrl?: string | null;
  creator?: IPostCreator;
  postsCount?: number;
  commentsCount?: number;
  upVotesCount?: number;
  downVotesCount?: number;
  comments?: unknown[];
}

export const enrichPostNode = (post: IPostNode) => {
  const creator = {
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
    id: post.id ?? post._id ?? `post-${Math.random()}`,
    caption: post.caption ?? 'Untitled',
    createdAt: post.createdAt ?? new Date().toISOString(),
    updatedAt: post.updatedAt ?? post.createdAt ?? new Date().toISOString(),
    pinnedAt: post.pinnedAt ?? null,
    pinned: post.pinned ?? false,
    attachments: post.attachments ?? [],
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
