type VolunteerStatus =
  | 'accepted'
  | 'pending'
  | 'requested'
  | 'rejected'
  | 'invited';

export interface InterfaceEventVolunteerOverride {
  hasAccepted?: boolean;
  volunteerStatus?: VolunteerStatus;
  userId?: string;
  userName?: string;
}

export interface InterfaceMembershipOptions {
  id: string;
  eventId: string;
  status: string;
  eventName?: string;
  startAt?: string;
  endAt?: string;
  recurrenceRuleId?: string | null;
  groupId?: string | null;
  groupName?: string;
  groupDescription?: string;
}

// Helper function to create common volunteer membership response
export const createMembershipResponse = (
  id: string,
  eventId: string,
  groupId?: string,
) => ({
  id: `membershipId${id}`,
  status: 'requested',
  createdAt: '2025-09-20T15:20:00.000Z',
  volunteer: {
    id: `volunteerId${id}`,
    hasAccepted: false,
    user: { id: 'userId', name: 'User Name' },
  },
  event: { id: eventId, name: `Event ${id}` },
  createdBy: { id: 'createrId', name: 'Creator Name' },
  ...(groupId && {
    group: { id: groupId, name: `Group ${id}`, description: 'desc' },
  }),
});

export const createEventVolunteer = (
  id: string,
  name: string,
  overrides: InterfaceEventVolunteerOverride = {},
) => ({
  id,
  hasAccepted: overrides.hasAccepted ?? false,
  volunteerStatus: overrides.volunteerStatus ?? 'pending',
  user: {
    id: overrides.userId ?? `${id}-user`,
    name: overrides.userName ?? name,
  },
});

export const createMembershipRecord = ({
  id,
  eventId,
  status,
  eventName,
  startAt,
  endAt,
  recurrenceRuleId = null,
  groupId = null,
  groupName,
  groupDescription,
}: InterfaceMembershipOptions) => ({
  id,
  status,
  createdAt: '2024-10-30T10:00:00.000Z',
  updatedAt: '2024-10-30T10:00:00.000Z',
  event: {
    id: eventId,
    name: eventName ?? `Event ${eventId}`,
    startAt: startAt ?? '2044-10-30T10:00:00.000Z',
    endAt: endAt ?? '2044-10-30T12:00:00.000Z',
    recurrenceRule: recurrenceRuleId
      ? {
          id: recurrenceRuleId,
        }
      : null,
  },
  volunteer: {
    id: `membershipVolunteer-${id}`,
    hasAccepted: status === 'accepted',
    hoursVolunteered: 0,
    user: {
      id: `membershipUser-${id}`,
      name: `Membership User ${id}`,
      emailAddress: `membership${id}@example.com`,
      avatarURL: null,
    },
  },
  createdBy: { id: 'creatorId', name: 'Creator Name' },
  updatedBy: { id: 'updaterId', name: 'Updater Name' },
  group: groupId
    ? {
        id: groupId,
        name: groupName ?? `Group ${groupId}`,
        description: groupDescription ?? 'Test Description',
      }
    : null,
});
