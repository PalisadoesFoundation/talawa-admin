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
