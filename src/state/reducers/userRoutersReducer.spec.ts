import expect from 'expect';
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
        { name: 'My Organizations', url: 'user/organizations' },
        { name: 'Posts', url: 'user/organization/undefined' },
        { name: 'People', url: 'user/people/undefined' },
        { name: 'Events', url: 'user/events/undefined' },
        { name: 'Volunteer', url: 'user/volunteer/undefined' },
        { name: 'Donate', url: 'user/donate/undefined' },
        { name: 'Chat', url: 'user/chat/undefined' },
        { name: 'Campaigns', url: 'user/campaigns/undefined' },
        { name: 'My Pledges', url: 'user/pledges/undefined' },
        { name: 'Leave Organization', url: 'user/leaveorg/undefined' },
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
        { name: 'People', comp_id: 'people', component: 'People' },
        { name: 'Events', comp_id: 'events', component: 'Events' },
        {
          name: 'Volunteer',
          comp_id: 'volunteer',
          component: 'VolunteerManagement',
        },
        { name: 'Donate', comp_id: 'donate', component: 'Donate' },
        { name: 'Chat', comp_id: 'chat', component: 'Chat' },
        {
          name: 'Campaigns',
          comp_id: 'campaigns',
          component: 'Campaigns',
        },
        { name: 'My Pledges', comp_id: 'pledges', component: 'Pledges' },
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
        { name: 'People', url: 'user/people/orgId' },
        { name: 'Events', url: 'user/events/orgId' },
        { name: 'Volunteer', url: 'user/volunteer/orgId' },
        { name: 'Donate', url: 'user/donate/orgId' },
        { name: 'Chat', url: 'user/chat/orgId' },
        { name: 'Campaigns', url: 'user/campaigns/orgId' },
        { name: 'My Pledges', url: 'user/pledges/orgId' },
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
        { name: 'People', comp_id: 'people', component: 'People' },
        { name: 'Events', comp_id: 'events', component: 'Events' },
        {
          name: 'Volunteer',
          comp_id: 'volunteer',
          component: 'VolunteerManagement',
        },
        { name: 'Donate', comp_id: 'donate', component: 'Donate' },
        { name: 'Chat', comp_id: 'chat', component: 'Chat' },
        {
          name: 'Campaigns',
          comp_id: 'campaigns',
          component: 'Campaigns',
        },
        { name: 'My Pledges', comp_id: 'pledges', component: 'Pledges' },
        {
          name: 'Leave Organization',
          comp_id: 'leaveorg',
          component: 'LeaveOrganization',
        },
      ],
    });
  });
});
