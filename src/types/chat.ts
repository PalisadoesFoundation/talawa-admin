import type { User } from './user';
import type { Organization } from './organization';

export type Chat = {
  _id: string;
  isGroup: boolean;
  name?: string; // Optional
  createdAt: Date;
  creator?: User; // Optional
  messages?: ChatMessage[]; // Optional and nullable
  organization?: Organization; // Optional
  updatedAt: Date;
  users: User[];
  admins?: User[]; // Optional and nullable
  lastMessageId?: string; // Optional
};

export type ChatMessage = {
  _id: string;
  createdAt: Date;
  chatMessageBelongsTo: Chat;
  messageContent: string;
  type: string;
  replyTo?: ChatMessage; // Optional
  sender: User;
  deletedBy?: User[]; // Optional and nullable
  updatedAt: Date;
};

export type ChatInput = {
  isGroup: boolean;
  organizationId?: string;
  userIds: string[];
  name?: string;
};
