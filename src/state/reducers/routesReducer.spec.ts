import { expect } from 'vitest';
import reducer, { ComponentType, generateRoutes } from './routesReducer';

describe('Testing Routes reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {
        type: '',
        payload: undefined,
      }),
    ).toEqual({
      targets: [
        { name: 'My Organizations', url: '/orglist' },
        { name: 'Dashboard', url: '/orgdash/undefined' },
        { name: 'Posts', url: '/orgpost/undefined' },
        { name: 'Chat', url: '/orgchat/undefined' },
        { name: 'Events', url: '/orgevents/undefined' },
        { name: 'People', url: '/orgpeople/undefined' },
        { name: 'Tags', url: '/orgtags/undefined' },
        { name: 'Advertisement', url: '/orgads/undefined' },
        { name: 'Funds', url: '/orgfunds/undefined' },
        { name: 'Transactions', url: '/orgtransactions/undefined' },
        { name: 'Membership Requests', url: '/requests/undefined' },
        { name: 'Block/Unblock', url: '/blockuser/undefined' },
        { name: 'Venues', url: '/orgvenues/undefined' },
        { name: 'Settings', url: '/orgsetting/undefined' },
      ],
      components: [
        {
          name: 'My Organizations',
          comp_id: 'orglist',
          component: 'OrgList',
        },
        {
          name: 'Dashboard',
          comp_id: 'orgdash',
          component: 'OrganizationDashboard',
        },
        {
          name: 'Posts',
          comp_id: 'orgpost',
          component: 'OrgPost',
        },
        {
          name: 'Chat',
          comp_id: 'orgchat',
          component: 'Chat',
        },
        {
          name: 'Events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        {
          name: 'People',
          comp_id: 'orgpeople',
          component: 'OrganizationPeople',
        },
        {
          name: 'Tags',
          comp_id: 'orgtags',
          component: 'OrganizationTags',
        },
        {
          name: 'Advertisement',
          comp_id: 'orgads',
          component: 'Advertisements',
        },
        {
          name: 'Funds',
          comp_id: 'orgfunds',
          component: 'OrganizationFunds',
        },
        {
          name: 'Transactions',
          comp_id: 'orgtransactions',
          component: 'OrganizationTransactions',
        },
        {
          name: 'Membership Requests',
          comp_id: 'requests',
          component: 'Requests',
        },
        {
          name: 'Block/Unblock',
          comp_id: 'blockuser',
          component: 'BlockUser',
        },
        {
          name: 'Venues',
          comp_id: 'orgvenues',
          component: 'OrganizationVenues',
        },
        {
          name: 'Settings',
          comp_id: 'orgsetting',
          component: 'OrgSettings',
        },
        {
          name: '',
          comp_id: 'member',
          component: 'MemberDetail',
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
        { name: 'My Organizations', url: '/orglist' },
        { name: 'Dashboard', url: '/orgdash/orgId' },
        { name: 'Posts', url: '/orgpost/orgId' },
        { name: 'Chat', url: '/orgchat/orgId' },
        { name: 'Events', url: '/orgevents/orgId' },
        { name: 'People', url: '/orgpeople/orgId' },
        { name: 'Tags', url: '/orgtags/orgId' },
        { name: 'Advertisement', url: '/orgads/orgId' },
        { name: 'Funds', url: '/orgfunds/orgId' },
        { name: 'Transactions', url: '/orgtransactions/orgId' },
        { name: 'Membership Requests', url: '/requests/orgId' },
        { name: 'Block/Unblock', url: '/blockuser/orgId' },
        { name: 'Venues', url: '/orgvenues/orgId' },
        { name: 'Settings', url: '/orgsetting/orgId' },
      ],
      components: [
        { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
        {
          name: 'Dashboard',
          comp_id: 'orgdash',
          component: 'OrganizationDashboard',
        },
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Chat', comp_id: 'orgchat', component: 'Chat' },
        {
          name: 'Events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        {
          name: 'People',
          comp_id: 'orgpeople',
          component: 'OrganizationPeople',
        },
        {
          name: 'Tags',
          comp_id: 'orgtags',
          component: 'OrganizationTags',
        },
        {
          name: 'Advertisement',
          comp_id: 'orgads',
          component: 'Advertisements',
        },
        { name: 'Funds', comp_id: 'orgfunds', component: 'OrganizationFunds' },
        {
          name: 'Transactions',
          comp_id: 'orgtransactions',
          component: 'OrganizationTransactions',
        },
        {
          name: 'Membership Requests',
          comp_id: 'requests',
          component: 'Requests',
        },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
        {
          name: 'Venues',
          comp_id: 'orgvenues',
          component: 'OrganizationVenues',
        },
        { name: 'Settings', comp_id: 'orgsetting', component: 'OrgSettings' },
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });

  it('should handle components with subTargets', () => {
    const testComponents: ComponentType[] = [
      {
        name: 'Parent Component',
        comp_id: null,
        component: null,
        subTargets: [
          {
            name: 'Sub Component 1',
            comp_id: 'sub1',
            component: 'SubComponent1',
            icon: 'icon1',
          },
          {
            name: 'Sub Component 2',
            comp_id: 'sub2',
            component: 'SubComponent2',
          },
        ],
      },
      {
        name: 'Regular Component',
        comp_id: 'regular',
        component: 'RegularComponent',
      },
    ];

    const result = generateRoutes(testComponents, 'orgId');

    expect(result).toEqual([
      {
        name: 'Parent Component',
        subTargets: [
          {
            name: 'Sub Component 1',
            url: '/sub1/orgId',
            icon: 'icon1',
          },
          {
            name: 'Sub Component 2',
            url: '/sub2/orgId',
            icon: undefined,
          },
        ],
      },
      {
        name: 'Regular Component',
        url: '/regular/orgId',
      },
    ]);
  });
});
