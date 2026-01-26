import { expect, afterEach, vi } from 'vitest';
import reducer from './userRoutesReducer';

afterEach(() => {
  vi.clearAllMocks();
});

describe('Testing Routes reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {
        type: '',
        payload: undefined,
      }),
    ).toEqual({
      targets: [
        { name: 'My Organizations', url: 'user/organizations' },
        { name: 'Posts', url: 'user/organization' },
        { name: 'Chat', url: 'user/chat' },
        { name: 'Events', url: 'user/events' },
        { name: 'Volunteer', url: 'user/volunteer' },
        { name: 'People', url: 'user/people' },
        { name: 'Donate', url: 'user/donate' },
        { name: 'Campaigns', url: 'user/campaigns' },
        { name: 'My Pledges', url: 'user/pledges' },
        { name: 'Transactions', url: 'user/transactions' },
        { name: 'Leave Organization', url: 'user/leaveorg' },
      ],
      components: [
        {
          name: 'My Organizations',
          comp_id: 'organizations',
          component: 'Organizations',
        },
        {
          name: 'Posts',
          comp_id: 'organization',
          component: 'Posts',
        },
        { name: 'Chat', comp_id: 'chat', component: 'Chat' },
        { name: 'Events', comp_id: 'events', component: 'Events' },
        {
          name: 'Volunteer',
          comp_id: 'volunteer',
          component: 'VolunteerManagement',
        },
        { name: 'People', comp_id: 'people', component: 'People' },
        { name: 'Donate', comp_id: 'donate', component: 'Donate' },
        {
          name: 'Campaigns',
          comp_id: 'campaigns',
          component: 'Campaigns',
        },
        { name: 'My Pledges', comp_id: 'pledges', component: 'Pledges' },
        {
          name: 'Transactions',
          comp_id: 'transactions',
          component: 'Transactions',
        },
        {
          name: 'Leave Organization',
          comp_id: 'leaveorg',
          component: 'LeaveOrganization',
        },
      ],
    });
  });

  it('should handle UPDATE_TARGETS', () => {
    expect(
      reducer(undefined, {
        type: 'UPDATE_TARGETS',
        payload: 'orgId',
      }),
    ).toEqual({
      targets: [
        { name: 'My Organizations', url: 'user/organizations' },
        { name: 'Posts', url: 'user/organization/orgId' },
        { name: 'Chat', url: 'user/chat/orgId' },
        { name: 'Events', url: 'user/events/orgId' },
        { name: 'Volunteer', url: 'user/volunteer/orgId' },
        { name: 'People', url: 'user/people/orgId' },
        { name: 'Donate', url: 'user/donate/orgId' },
        { name: 'Campaigns', url: 'user/campaigns/orgId' },
        { name: 'My Pledges', url: 'user/pledges/orgId' },
        { name: 'Transactions', url: 'user/transactions/orgId' },
        { name: 'Leave Organization', url: 'user/leaveorg/orgId' },
      ],
      components: [
        {
          name: 'My Organizations',
          comp_id: 'organizations',
          component: 'Organizations',
        },
        {
          name: 'Posts',
          comp_id: 'organization',
          component: 'Posts',
        },
        { name: 'Chat', comp_id: 'chat', component: 'Chat' },
        { name: 'Events', comp_id: 'events', component: 'Events' },
        {
          name: 'Volunteer',
          comp_id: 'volunteer',
          component: 'VolunteerManagement',
        },
        { name: 'People', comp_id: 'people', component: 'People' },
        { name: 'Donate', comp_id: 'donate', component: 'Donate' },
        {
          name: 'Campaigns',
          comp_id: 'campaigns',
          component: 'Campaigns',
        },
        { name: 'My Pledges', comp_id: 'pledges', component: 'Pledges' },
        {
          name: 'Transactions',
          comp_id: 'transactions',
          component: 'Transactions',
        },
        {
          name: 'Leave Organization',
          comp_id: 'leaveorg',
          component: 'LeaveOrganization',
        },
      ],
    });
  });
});
