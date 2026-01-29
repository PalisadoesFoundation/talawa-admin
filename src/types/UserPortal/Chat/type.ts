import type { User } from 'types/shared-components/User/type';
import type { Organization } from 'types/AdminPortal/Organization/type';

export type DirectMessage = {
  _id: string;
  createdAt: Date;
  sender: User;
  receiver?: User; //Optional
  replyTo?: DirectMessage; // Optional
  messageContent: string;
  chatMessageBelongsTo?: GroupChat;
  media?: string; // Optional
  type?: string;
  deletedBy?: User[]; // Optional and nullable
  updatedAt: Date;
};

export type GroupChat = {
  _id: string;
  isGroup: boolean;
  name?: string; // Optional
  image?: string;
  messages: DirectMessage[]; // nullable
  admins: User[]; // Optional and nullable
  users: User[];
  unseenMessagesByUsers: string;
  description: string;
  createdAt: Date;
  creator?: User; // Optional
  organization?: Organization; // Optional
  updatedAt?: Date; // Optional
  lastMessageId?: string; // Optional
};

export type ChatInput = {
  isGroup: boolean;
  organizationId?: string;
  userIds: string[];
  name?: string;
};
