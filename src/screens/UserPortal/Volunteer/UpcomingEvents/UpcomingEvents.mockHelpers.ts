// Helper function to create common volunteer membership response
export const createMembershipResponse = (
  id: string,
  eventId: string,
  groupId?: string,
) => ({
  __typename: 'VolunteerMembership',
  id: `membershipId${id}`,
  status: 'requested',
  createdAt: '2025-09-20T15:20:00.000Z',
  volunteer: {
    __typename: 'EventVolunteer',
    id: `volunteerId${id}`,
    hasAccepted: false,
    user: { __typename: 'User', id: 'userId', name: 'User Name' },
  },
  event: { __typename: 'Event', id: eventId, name: `Event ${id}` },
  createdBy: { __typename: 'User', id: 'createrId', name: 'Creator Name' },
  ...(groupId && {
    group: {
      __typename: 'EventVolunteerGroup',
      id: groupId,
      name: `Group ${id}`,
      description: 'desc',
    },
  }),
});

export const createMembershipWithStatus = (
  id: string,
  eventId: string,
  status: string,
  groupId?: string,
) => ({
  __typename: 'VolunteerMembership',
  id: `membership${id}`,
  status,
  createdAt: '2024-10-30T10:00:00.000Z',
  updatedAt: '2024-10-30T10:00:00.000Z',
  event: {
    __typename: 'Event',
    id: eventId,
    name: eventId === 'eventId1' ? 'Test Event' : `Event ${eventId}`,
    startAt: '2044-10-30T10:00:00.000Z',
    endAt: '2044-10-30T12:00:00.000Z',
    recurrenceRule: null,
  },
  volunteer: {
    __typename: 'EventVolunteer',
    id: `volunteerId${id}`,
    createdBy: { __typename: 'User', id: 'userId' },
    updatedBy: { __typename: 'User', id: 'userId' },
  },
  group: {
    __typename: 'EventVolunteerGroup',
    id: groupId,
    name: 'Test Group',
    description: 'Test Description',
  },
});
