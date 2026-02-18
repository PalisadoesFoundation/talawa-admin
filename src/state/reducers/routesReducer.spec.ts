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
        { name: 'My Organizations', url: '/admin/orglist' },
        { name: 'Dashboard', url: '/admin/orgdash/undefined' },
        { name: 'Posts', url: '/admin/orgpost/undefined' },
        { name: 'Chat', url: '/admin/orgchat/undefined' },
        { name: 'Events', url: '/admin/orgevents/undefined' },
        { name: 'People', url: '/admin/orgpeople/undefined' },
        { name: 'Tags', url: '/admin/orgtags/undefined' },
        { name: 'Advertisement', url: '/admin/orgads/undefined' },
        { name: 'Funds', url: '/admin/orgfunds/undefined' },
        { name: 'Transactions', url: '/admin/orgtransactions/undefined' },
        { name: 'Membership Requests', url: '/admin/requests/undefined' },
        { name: 'Block/Unblock', url: '/admin/blockuser/undefined' },
        { name: 'Venues', url: '/admin/orgvenues/undefined' },
        { name: 'Settings', url: '/admin/orgsetting/undefined' },
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
        { name: 'My Organizations', url: '/admin/orglist' },
        { name: 'Dashboard', url: '/admin/orgdash/orgId' },
        { name: 'Posts', url: '/admin/orgpost/orgId' },
        { name: 'Chat', url: '/admin/orgchat/orgId' },
        { name: 'Events', url: '/admin/orgevents/orgId' },
        { name: 'People', url: '/admin/orgpeople/orgId' },
        { name: 'Tags', url: '/admin/orgtags/orgId' },
        { name: 'Advertisement', url: '/admin/orgads/orgId' },
        { name: 'Funds', url: '/admin/orgfunds/orgId' },
        { name: 'Transactions', url: '/admin/orgtransactions/orgId' },
        { name: 'Membership Requests', url: '/admin/requests/orgId' },
        { name: 'Block/Unblock', url: '/admin/blockuser/orgId' },
        { name: 'Venues', url: '/admin/orgvenues/orgId' },
        { name: 'Settings', url: '/admin/orgsetting/orgId' },
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
            url: '/admin/sub1/orgId',
            icon: 'icon1',
          },
          {
            name: 'Sub Component 2',
            url: '/admin/sub2/orgId',
            icon: undefined,
          },
        ],
      },
      {
        name: 'Regular Component',
        url: '/admin/regular/orgId',
      },
    ]);
  });
});
