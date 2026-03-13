import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { filterEvents } from './utils';
import { UserRole } from './interface';
import type { InterfaceEvent, InterfaceIOrgList } from './interface';

dayjs.extend(utc);

// Fixed UTC timestamps (no date string literal) for deterministic tests per CodeRabbit
const fixedStartMs = Date.UTC(2025, 0, 1, 12, 0, 0);
const fixedEndMs = Date.UTC(2025, 0, 1, 18, 0, 0);

const baseEvent: InterfaceEvent = {
  id: 'e1',
  name: 'Test Event',
  description: '',
  startAt: dayjs.utc(fixedStartMs).toISOString(),
  endAt: dayjs.utc(fixedEndMs).toISOString(),
  location: '',
  startTime: null,
  endTime: null,
  allDay: true,
  isPublic: false,
  isRegisterable: true,
  isInviteOnly: false,
  attendees: [],
  creator: { id: 'creator1', name: 'Creator' },
};

describe('filterEvents', () => {
  it('returns empty array when eventData is null/undefined', () => {
    expect(filterEvents([])).toEqual([]);
    expect(filterEvents(null as unknown as InterfaceEvent[])).toEqual([]);
    expect(filterEvents(undefined as unknown as InterfaceEvent[])).toEqual([]);
  });

  it('returns only public events when userRole or userId is missing', () => {
    const events: InterfaceEvent[] = [
      { ...baseEvent, id: '1', isPublic: true },
      { ...baseEvent, id: '2', isPublic: false },
    ];
    expect(filterEvents(events, undefined, undefined, undefined)).toEqual([
      events[0],
    ]);
    expect(filterEvents(events, undefined, 'REGULAR', undefined)).toEqual([
      events[0],
    ]);
    expect(filterEvents(events, undefined, undefined, 'user1')).toEqual([
      events[0],
    ]);
  });

  it('returns all events when user is ADMINISTRATOR', () => {
    const events: InterfaceEvent[] = [
      { ...baseEvent, id: '1', isPublic: true },
      { ...baseEvent, id: '2', isPublic: false },
    ];
    expect(
      filterEvents(events, undefined, UserRole.ADMINISTRATOR, 'admin1'),
    ).toEqual(events);
  });

  it('returns event when REGULAR user is the creator', () => {
    const events: InterfaceEvent[] = [
      { ...baseEvent, id: '1', creator: { id: 'user1', name: 'User' } },
    ];
    expect(filterEvents(events, undefined, UserRole.REGULAR, 'user1')).toEqual(
      events,
    );
  });

  it('returns event when REGULAR user and event is public', () => {
    const events: InterfaceEvent[] = [
      { ...baseEvent, id: '1', isPublic: true },
    ];
    expect(filterEvents(events, undefined, UserRole.REGULAR, 'user1')).toEqual(
      events,
    );
  });

  it('returns invite-only event when REGULAR user is creator or attendee', () => {
    const creatorEvent: InterfaceEvent = {
      ...baseEvent,
      id: '1',
      isInviteOnly: true,
      creator: { id: 'user1', name: 'User' },
    };
    const attendeeEvent: InterfaceEvent = {
      ...baseEvent,
      id: '2',
      isInviteOnly: true,
      creator: { id: 'other', name: 'Other' },
      attendees: [{ id: 'user1', name: 'User' }],
    };
    const strangerEvent: InterfaceEvent = {
      ...baseEvent,
      id: '3',
      isInviteOnly: true,
      creator: { id: 'other', name: 'Other' },
      attendees: [],
    };
    const events = [creatorEvent, attendeeEvent, strangerEvent];
    const result = filterEvents(events, undefined, UserRole.REGULAR, 'user1');
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('returns org-member event when orgData has user in members (REGULAR user)', () => {
    const orgMemberEvent: InterfaceEvent = {
      ...baseEvent,
      id: '1',
      isPublic: false,
      isInviteOnly: false,
      creator: { id: 'other', name: 'Other' },
    };
    const orgData: InterfaceIOrgList = {
      id: 'org1',
      members: {
        edges: [
          {
            node: { id: 'user1', name: 'User', emailAddress: 'u@x.com' },
            cursor: '',
          },
        ],
        pageInfo: { hasNextPage: false, endCursor: '' },
      },
    };
    expect(
      filterEvents([orgMemberEvent], orgData, UserRole.REGULAR, 'user1'),
    ).toEqual([orgMemberEvent]);
  });

  it('filters out org-member event when orgData has members but user not in list', () => {
    const orgMemberEvent: InterfaceEvent = {
      ...baseEvent,
      id: '1',
      isPublic: false,
      isInviteOnly: false,
      creator: { id: 'other', name: 'Other' },
    };
    const orgData: InterfaceIOrgList = {
      id: 'org1',
      members: {
        edges: [
          {
            node: { id: 'otherUser', name: 'Other', emailAddress: 'o@x.com' },
            cursor: '',
          },
        ],
        pageInfo: { hasNextPage: false, endCursor: '' },
      },
    };
    expect(
      filterEvents([orgMemberEvent], orgData, UserRole.REGULAR, 'user1'),
    ).toEqual([]);
  });

  it('returns org-member event when orgData has no members (trust backend, e.g. User Portal)', () => {
    const orgMemberEvent: InterfaceEvent = {
      ...baseEvent,
      id: '1',
      isPublic: false,
      isInviteOnly: false,
      creator: { id: 'admin1', name: 'Admin' },
    };
    // No members list (e.g. ORGANIZATIONS_LIST_BASIC)
    const orgDataNoMembers = {
      id: 'org1',
      members: { edges: [], pageInfo: { hasNextPage: false, endCursor: '' } },
    } as InterfaceIOrgList;
    expect(
      filterEvents(
        [orgMemberEvent],
        orgDataNoMembers,
        UserRole.REGULAR,
        'user1',
      ),
    ).toEqual([orgMemberEvent]);
  });

  it('returns org-member event when orgData is undefined (trust backend)', () => {
    const orgMemberEvent: InterfaceEvent = {
      ...baseEvent,
      id: '1',
      isPublic: false,
      isInviteOnly: false,
      creator: { id: 'other', name: 'Other' },
    };
    expect(
      filterEvents([orgMemberEvent], undefined, UserRole.REGULAR, 'user1'),
    ).toEqual([orgMemberEvent]);
  });
});
