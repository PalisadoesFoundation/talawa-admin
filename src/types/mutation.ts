// import { MembershipRequest } from "./membership";
// import { User } from "./user";
// import { Feedback } from "./feedback";
// import { Language } from "./language";
// import { OrganizationCustomField } from "./organization";
// import { UserCustomData } from "./user";
// import { UserFamily } from "./user";
// import { Event } from "./event";
// import { ActionItem } from "./actionItem";
// import { Advertisement } from "./advertisement";
// import { Comment } from "./comment";
// import { Chat } from "./chat";
// import { Donation } from "./donation";
// import { Venue } from "./venue";
// import { Post } from "./post";
// import { Organization } from "./organization";
// import { Plugin } from "./plugin";
// import { AuthData } from "./auth";
// import { ExtendSession } from "./others";
// import { ChatMessage } from "./chat";
// import { BooleanResponse } from "./commonTypes";

// export type Mutation = {
//   acceptMembershipRequest: (membershipRequestId: string) => Promise<MembershipRequest>;
//   addEventAttendee: (data: EventAttendeeInput) => Promise<User>;
//   addFeedback: (data: FeedbackInput) => Promise<Feedback>;
//   addLanguageTranslation: (data: LanguageInput) => Promise<Language>;
//   addOrganizationCustomField: (
//     name: string,
//     organizationId: string,
//     type: string
//   ) => Promise<OrganizationCustomField>;
//   addOrganizationImage: (file: string, organizationId: string) => Promise<Organization>;
//   addUserCustomData: (
//     dataName: string,
//     dataValue: any,
//     organizationId: string
//   ) => Promise<UserCustomData>;
//   addUserImage: (file: string) => Promise<User>;
//   addUserToUserFamily: (familyId: string, userId: string) => Promise<UserFamily>;
//   adminRemoveEvent: (eventId: string) => Promise<Event>;
//   assignUserTag: (input: ToggleUserTagAssignInput) => Promise<User | null>;
//   blockPluginCreationBySuperadmin: (blockUser: boolean, userId: string) => Promise<AppUserProfile>;
//   blockUser: (organizationId: string, userId: string) => Promise<User>;
//   cancelMembershipRequest: (membershipRequestId: string) => Promise<MembershipRequest>;
//   checkIn: (data: CheckInInput) => Promise<CheckIn>;
//   createActionItem: (actionItemCategoryId: string, data: CreateActionItemInput) => Promise<ActionItem>;
//   createAdvertisement: (input: CreateAdvertisementInput) => Promise<Advertisement>;
//   createComment: (data: CommentInput, postId: string) => Promise<Comment>;
//   createChat: (data: ChatInput) => Promise<Chat>;
//   createDonation: (data: CreateDonationInput) => Promise<Donation>;
//   createEvent: (data: EventInput, recurrenceRuleData?: RecurrenceRuleInput) => Promise<Event>;
//   createVenue: (data: VenueInput) => Promise<Venue>;
//   deleteAdvertisement: (id: string) => Promise<BooleanResponse>;
//   deleteVenue: (id: string) => Promise<Venue>;
//   editVenue: (data: EditVenueInput) => Promise<Venue>;
//   forgotPassword: (data: ForgotPasswordData) => Promise<boolean>;
//   likeComment: (id: string) => Promise<Comment>;
//   likePost: (id: string) => Promise<Post>;
//   logout: () => Promise<boolean>;
//   refreshToken: (refreshToken: string) => Promise<ExtendSession>;
//   registerForEvent: (id: string) => Promise<Event>;
//   removeEvent: (id: string) => Promise<Event>;
//   removePost: (id: string) => Promise<Post>;
//   sendMembershipRequest: (organizationId: string) => Promise<MembershipRequest>;
//   sendMessageToChat: (
//     chatId: string,
//     messageContent: string,
//     type: string,
//     replyTo?: string
//   ) => Promise<ChatMessage>;
//   signUp: (input: UserInput, file?: string) => Promise<AuthData>;
//   updateUserProfile: (data: UpdateUserInput, file?: string) => Promise<User>;
//   updateOrganization: (data: UpdateOrganizationInput, id: string, file?: string) => Promise<Organization>;
// };
