/**
 * Shape of the event invitation payload returned by verifyEventInvitation.
 */
export interface IInviteMetadata {
  invitationToken: string;
  inviteeEmailMasked?: string | null;
  inviteeName?: string | null;
  status?: string | null;
  expiresAt?: string | null;
  eventId?: string | null;
  recurringEventInstanceId?: string | null;
  organizationId?: string | null;
}
