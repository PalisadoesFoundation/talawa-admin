import dayjs from 'dayjs';

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
  createdAt: dayjs().toISOString(),
  updatedAt: dayjs().toISOString(),
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
