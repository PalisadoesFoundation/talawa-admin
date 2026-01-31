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
        { name: 'myOrganizations', url: '/admin/orglist' },
        { name: 'dashboard', url: '/admin/orgdash/undefined' },
        { name: 'posts', url: '/admin/orgpost/undefined' },
        { name: 'chat', url: '/admin/orgchat/undefined' },
        { name: 'events', url: '/admin/orgevents/undefined' },
        { name: 'people', url: '/admin/orgpeople/undefined' },
        { name: 'tags', url: '/admin/orgtags/undefined' },
        { name: 'advertisement', url: '/admin/orgads/undefined' },
        { name: 'funds', url: '/admin/orgfunds/undefined' },
        { name: 'transactions', url: '/admin/orgtransactions/undefined' },
        { name: 'membershipRequests', url: '/admin/requests/undefined' },
        { name: 'blockUnblock', url: '/admin/blockuser/undefined' },
        { name: 'venues', url: '/admin/orgvenues/undefined' },
        { name: 'settings', url: '/admin/orgsetting/undefined' },
      ],
      components: [
        {
          name: 'myOrganizations',
          comp_id: 'orglist',
          component: 'OrgList',
        },
        {
          name: 'dashboard',
          comp_id: 'orgdash',
          component: 'OrganizationDashboard',
        },
        {
          name: 'posts',
          comp_id: 'orgpost',
          component: 'OrgPost',
        },
        {
          name: 'chat',
          comp_id: 'orgchat',
          component: 'Chat',
        },
        {
          name: 'events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        {
          name: 'people',
          comp_id: 'orgpeople',
          component: 'OrganizationPeople',
        },
        {
          name: 'tags',
          comp_id: 'orgtags',
          component: 'OrganizationTags',
        },
        {
          name: 'advertisement',
          comp_id: 'orgads',
          component: 'Advertisements',
        },
        {
          name: 'funds',
          comp_id: 'orgfunds',
          component: 'OrganizationFunds',
        },
        {
          name: 'transactions',
          comp_id: 'orgtransactions',
          component: 'OrganizationTransactions',
        },
        {
          name: 'membershipRequests',
          comp_id: 'requests',
          component: 'Requests',
        },
        {
          name: 'blockUnblock',
          comp_id: 'blockuser',
          component: 'BlockUser',
        },
        {
          name: 'venues',
          comp_id: 'orgvenues',
          component: 'OrganizationVenues',
        },
        {
          name: 'settings',
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
        { name: 'myOrganizations', url: '/admin/orglist' },
        { name: 'dashboard', url: '/admin/orgdash/orgId' },
        { name: 'posts', url: '/admin/orgpost/orgId' },
        { name: 'chat', url: '/admin/orgchat/orgId' },
        { name: 'events', url: '/admin/orgevents/orgId' },
        { name: 'people', url: '/admin/orgpeople/orgId' },
        { name: 'tags', url: '/admin/orgtags/orgId' },
        { name: 'advertisement', url: '/admin/orgads/orgId' },
        { name: 'funds', url: '/admin/orgfunds/orgId' },
        { name: 'transactions', url: '/admin/orgtransactions/orgId' },
        { name: 'membershipRequests', url: '/admin/requests/orgId' },
        { name: 'blockUnblock', url: '/admin/blockuser/orgId' },
        { name: 'venues', url: '/admin/orgvenues/orgId' },
        { name: 'settings', url: '/admin/orgsetting/orgId' },
      ],
      components: [
        { name: 'myOrganizations', comp_id: 'orglist', component: 'OrgList' },
        {
          name: 'dashboard',
          comp_id: 'orgdash',
          component: 'OrganizationDashboard',
        },
        { name: 'posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'chat', comp_id: 'orgchat', component: 'Chat' },
        {
          name: 'events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        {
          name: 'people',
          comp_id: 'orgpeople',
          component: 'OrganizationPeople',
        },
        {
          name: 'tags',
          comp_id: 'orgtags',
          component: 'OrganizationTags',
        },
        {
          name: 'advertisement',
          comp_id: 'orgads',
          component: 'Advertisements',
        },
        { name: 'funds', comp_id: 'orgfunds', component: 'OrganizationFunds' },
        {
          name: 'transactions',
          comp_id: 'orgtransactions',
          component: 'OrganizationTransactions',
        },
        {
          name: 'membershipRequests',
          comp_id: 'requests',
          component: 'Requests',
        },
        { name: 'blockUnblock', comp_id: 'blockuser', component: 'BlockUser' },
        {
          name: 'venues',
          comp_id: 'orgvenues',
          component: 'OrganizationVenues',
        },
        { name: 'settings', comp_id: 'orgsetting', component: 'OrgSettings' },
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
