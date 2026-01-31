import { expect } from 'vitest';
import reducer from './userRoutesReducer';

describe('Testing Routes reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {
        type: '',
        payload: undefined,
      }),
    ).toEqual({
      targets: [
        { name: 'myOrganizations', url: 'user/organizations' },
        { name: 'posts', url: 'user/organization' },
        { name: 'chat', url: 'user/chat' },
        { name: 'events', url: 'user/events' },
        { name: 'volunteer', url: 'user/volunteer' },
        { name: 'people', url: 'user/people' },
        { name: 'donate', url: 'user/donate' },
        { name: 'campaigns', url: 'user/campaigns' },
        { name: 'myPledges', url: 'user/pledges' },
        { name: 'transactions', url: 'user/transactions' },
        { name: 'leaveOrganization', url: 'user/leaveorg' },
      ],
      components: [
        {
          name: 'myOrganizations',
          comp_id: 'organizations',
          component: 'Organizations',
        },
        {
          name: 'posts',
          comp_id: 'organization',
          component: 'Posts',
        },
        { name: 'chat', comp_id: 'chat', component: 'Chat' },
        { name: 'events', comp_id: 'events', component: 'Events' },
        {
          name: 'volunteer',
          comp_id: 'volunteer',
          component: 'VolunteerManagement',
        },
        { name: 'people', comp_id: 'people', component: 'People' },
        { name: 'donate', comp_id: 'donate', component: 'Donate' },
        {
          name: 'campaigns',
          comp_id: 'campaigns',
          component: 'Campaigns',
        },
        { name: 'myPledges', comp_id: 'pledges', component: 'Pledges' },
        {
          name: 'transactions',
          comp_id: 'transactions',
          component: 'Transactions',
        },
        {
          name: 'leaveOrganization',
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
        { name: 'myOrganizations', url: 'user/organizations' },
        { name: 'posts', url: 'user/organization/orgId' },
        { name: 'chat', url: 'user/chat/orgId' },
        { name: 'events', url: 'user/events/orgId' },
        { name: 'volunteer', url: 'user/volunteer/orgId' },
        { name: 'people', url: 'user/people/orgId' },
        { name: 'donate', url: 'user/donate/orgId' },
        { name: 'campaigns', url: 'user/campaigns/orgId' },
        { name: 'myPledges', url: 'user/pledges/orgId' },
        { name: 'transactions', url: 'user/transactions/orgId' },
        { name: 'leaveOrganization', url: 'user/leaveorg/orgId' },
      ],
      components: [
        {
          name: 'myOrganizations',
          comp_id: 'organizations',
          component: 'Organizations',
        },
        {
          name: 'posts',
          comp_id: 'organization',
          component: 'Posts',
        },
        { name: 'chat', comp_id: 'chat', component: 'Chat' },
        { name: 'events', comp_id: 'events', component: 'Events' },
        {
          name: 'volunteer',
          comp_id: 'volunteer',
          component: 'VolunteerManagement',
        },
        { name: 'people', comp_id: 'people', component: 'People' },
        { name: 'donate', comp_id: 'donate', component: 'Donate' },
        {
          name: 'campaigns',
          comp_id: 'campaigns',
          component: 'Campaigns',
        },
        { name: 'myPledges', comp_id: 'pledges', component: 'Pledges' },
        {
          name: 'transactions',
          comp_id: 'transactions',
          component: 'Transactions',
        },
        {
          name: 'leaveOrganization',
          comp_id: 'leaveorg',
          component: 'LeaveOrganization',
        },
      ],
    });
  });
});
