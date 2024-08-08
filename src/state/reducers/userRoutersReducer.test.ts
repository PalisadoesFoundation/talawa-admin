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
        { name: 'Donate', url: 'user/donate/undefined' },
        { name: 'Campaigns', url: 'user/campaigns/undefined' },
        { name: 'My Pledges', url: 'user/pledges/undefined' },
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
        { name: 'Donate', comp_id: 'donate', component: 'Donate' },
        {
          name: 'Campaigns',
          comp_id: 'campaigns',
          component: 'Campaigns',
        },
        { name: 'My Pledges', comp_id: 'pledges', component: 'Pledges' },
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
        { name: 'Donate', url: 'user/donate/orgId' },
        { name: 'Campaigns', url: 'user/campaigns/orgId' },
        { name: 'My Pledges', url: 'user/pledges/orgId' },
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
        { name: 'Donate', comp_id: 'donate', component: 'Donate' },
        {
          name: 'Campaigns',
          comp_id: 'campaigns',
          component: 'Campaigns',
        },
        { name: 'My Pledges', comp_id: 'pledges', component: 'Pledges' },
      ],
    });
  });
});
