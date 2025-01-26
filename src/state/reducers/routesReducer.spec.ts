import expect from 'expect';
import reducer from './routesReducer';

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
        { name: 'People', url: '/orgpeople/undefined' },
        { name: 'Tags', url: '/orgtags/undefined' },
        { name: 'Events', url: '/orgevents/undefined' },
        { name: 'Venues', url: '/orgvenues/undefined' },
        { name: 'Action Items', url: '/orgactionitems/undefined' },
        { name: 'Posts', url: '/orgpost/undefined' },
        {
          name: 'Block/Unblock',
          url: '/blockuser/undefined',
        },
        { name: 'Advertisement', url: '/orgads/undefined' },
        { name: 'Funds', url: '/orgfunds/undefined' },
        { name: 'Membership Requests', url: '/requests/undefined' },
        {
          name: 'Plugins',
          subTargets: [
            {
              icon: 'fa-store',
              name: 'Plugin Store',
              url: '/orgstore/undefined',
            },
          ],
        },
        { name: 'Settings', url: '/orgsetting/undefined' },
      ],
      components: [
        { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
        {
          name: 'Dashboard',
          comp_id: 'orgdash',
          component: 'OrganizationDashboard',
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
          name: 'Events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        {
          name: 'Venues',
          comp_id: 'orgvenues',
          component: 'OrganizationVenues',
        },
        {
          name: 'Action Items',
          comp_id: 'orgactionitems',
          component: 'OrganizationActionItems',
        },
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
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
          name: 'Membership Requests',
          comp_id: 'requests',
          component: 'Requests',
        },
        {
          name: 'Plugins',
          comp_id: null,
          component: 'AddOnStore',
          subTargets: [
            {
              comp_id: 'orgstore',
              component: 'AddOnStore',
              icon: 'fa-store',
              name: 'Plugin Store',
            },
          ],
        },
        { name: 'Settings', comp_id: 'orgsetting', component: 'OrgSettings' },
        { name: '', comp_id: 'member', component: 'MemberDetail' },
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
        { name: 'People', url: '/orgpeople/orgId' },
        { name: 'Tags', url: '/orgtags/orgId' },
        { name: 'Events', url: '/orgevents/orgId' },
        { name: 'Venues', url: '/orgvenues/orgId' },
        { name: 'Action Items', url: '/orgactionitems/orgId' },
        { name: 'Posts', url: '/orgpost/orgId' },
        { name: 'Block/Unblock', url: '/blockuser/orgId' },
        { name: 'Advertisement', url: '/orgads/orgId' },
        { name: 'Funds', url: '/orgfunds/orgId' },
        { name: 'Membership Requests', url: '/requests/orgId' },
        {
          name: 'Plugins',
          subTargets: [
            {
              icon: 'fa-store',
              name: 'Plugin Store',
              url: '/orgstore/orgId',
            },
          ],
        },
        { name: 'Settings', url: '/orgsetting/orgId' },
      ],
      components: [
        { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
        {
          name: 'Dashboard',
          comp_id: 'orgdash',
          component: 'OrganizationDashboard',
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
          name: 'Events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        {
          name: 'Venues',
          comp_id: 'orgvenues',
          component: 'OrganizationVenues',
        },
        {
          name: 'Action Items',
          comp_id: 'orgactionitems',
          component: 'OrganizationActionItems',
        },
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
        {
          name: 'Advertisement',
          comp_id: 'orgads',
          component: 'Advertisements',
        },
        { name: 'Funds', comp_id: 'orgfunds', component: 'OrganizationFunds' },
        {
          name: 'Membership Requests',
          comp_id: 'requests',
          component: 'Requests',
        },
        {
          name: 'Plugins',
          comp_id: null,
          component: 'AddOnStore',
          subTargets: [
            {
              comp_id: 'orgstore',
              component: 'AddOnStore',
              icon: 'fa-store',
              name: 'Plugin Store',
            },
          ],
        },
        { name: 'Settings', comp_id: 'orgsetting', component: 'OrgSettings' },
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });

  it('should handle UPDATE_P_TARGETS', () => {
    expect(
      reducer(undefined, {
        type: 'UPDATE_P_TARGETS',
        payload: [{ name: 'test-target-plugin', content: 'plugin-new' }],
      }),
    ).toEqual({
      targets: [
        { name: 'My Organizations', url: '/orglist' },
        { name: 'Dashboard', url: '/orgdash/undefined' },
        { name: 'People', url: '/orgpeople/undefined' },
        { name: 'Tags', url: '/orgtags/undefined' },
        { name: 'Events', url: '/orgevents/undefined' },
        { name: 'Venues', url: '/orgvenues/undefined' },
        { name: 'Action Items', url: '/orgactionitems/undefined' },
        { name: 'Posts', url: '/orgpost/undefined' },
        {
          name: 'Block/Unblock',
          url: '/blockuser/undefined',
        },
        { name: 'Advertisement', url: '/orgads/undefined' },
        { name: 'Funds', url: '/orgfunds/undefined' },
        { name: 'Membership Requests', url: '/requests/undefined' },
        { name: 'Settings', url: '/orgsetting/undefined' },
        {
          comp_id: null,
          component: null,
          name: 'Plugins',
          subTargets: [
            { name: 'test-target-plugin', content: 'plugin-new' },
            {
              icon: 'fa-store',
              name: 'Plugin Store',
              url: '/orgstore/undefined',
            },
          ],
        },
      ],
      components: [
        { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
        {
          name: 'Dashboard',
          comp_id: 'orgdash',
          component: 'OrganizationDashboard',
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
          name: 'Events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        {
          name: 'Venues',
          comp_id: 'orgvenues',
          component: 'OrganizationVenues',
        },
        {
          name: 'Action Items',
          comp_id: 'orgactionitems',
          component: 'OrganizationActionItems',
        },
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
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
          name: 'Membership Requests',
          comp_id: 'requests',
          component: 'Requests',
        },
        {
          name: 'Plugins',
          comp_id: null,
          component: 'AddOnStore',
          subTargets: [
            {
              comp_id: 'orgstore',
              component: 'AddOnStore',
              icon: 'fa-store',
              name: 'Plugin Store',
            },
          ],
        },
        { name: 'Settings', comp_id: 'orgsetting', component: 'OrgSettings' },
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });
});

describe('routesReducer', () => {
  it('returns state with updated subTargets when UPDATE_P_TARGETS action is dispatched', () => {
    const action = {
      type: 'UPDATE_P_TARGETS',
      payload: [{ name: 'New Plugin', url: '/newplugin' }],
    };
    const initialState = {
      targets: [{ name: 'Plugins' }],
      components: [],
    };
    const state = reducer(initialState, action);
    const pluginsTarget = state.targets.find(
      (target) => target.name === 'Plugins',
    );
    // Check if pluginsTarget is defined
    if (!pluginsTarget) {
      throw new Error('Plugins target not found in state');
    }
    expect(pluginsTarget.subTargets).toEqual([
      { name: 'New Plugin', url: '/newplugin' },
    ]);
  });
});
