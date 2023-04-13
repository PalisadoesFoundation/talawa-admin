import reducer from './routesReducer';
import expect from 'expect';

describe('Testing Routes reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {
        type: '',
        payload: undefined,
      })
    ).toEqual({
      targets: [
        { name: 'Dashboard', url: '/orgdash/id=undefined' },
        { name: 'People', url: '/orgpeople/id=undefined' },
        { name: 'Events', url: '/orgevents/id=undefined' },
        // { name: 'Contributions', url: '/orgcontribution/id=undefined' },
        { name: 'Posts', url: '/orgpost/id=undefined' },
        {
          name: 'Block/Unblock',
          url: '/blockuser/id=undefined',
        },
        {
          name: 'Plugins',
          subTargets: [
            {
              icon: 'fa-store',
              name: 'Plugin Store',
              url: '/orgstore/id=undefined',
            },
          ],
        },
      ],
      configUrl: 'undefined',
      components: [
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
          name: 'Events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        // {
        //   name: 'Contributions',
        //   comp_id: 'orgcontribution',
        //   component: 'OrgContribution',
        // },
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
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
        { name: '', comp_id: 'orglist', component: 'OrgList' },
        { name: '', comp_id: 'orgsetting', component: 'OrgSettings' },
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });

  it('should handle UPDATE_TARGETS', () => {
    expect(
      reducer(undefined, {
        type: 'UPDATE_TARGETS',
        payload: { test: 'testupdate' },
      })
    ).toEqual({
      targets: [
        { name: 'Dashboard', url: '/orgdash/id=undefined' },
        { name: 'People', url: '/orgpeople/id=undefined' },
        { name: 'Events', url: '/orgevents/id=undefined' },
        // { name: 'Contributions', url: '/orgcontribution/id=undefined' },
        { name: 'Posts', url: '/orgpost/id=undefined' },
        { name: 'Block/Unblock', url: '/blockuser/id=undefined' },
        {
          name: 'Plugins',
          subTargets: [
            {
              icon: 'fa-store',
              name: 'Plugin Store',
              url: '/orgstore/id=undefined',
            },
          ],
        },
        { test: 'testupdate' },
      ],
      configUrl: 'undefined',
      components: [
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
          name: 'Events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        // {
        //   name: 'Contributions',
        //   comp_id: 'orgcontribution',
        //   component: 'OrgContribution',
        // },
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
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
        { name: '', comp_id: 'orglist', component: 'OrgList' },
        { name: '', comp_id: 'orgsetting', component: 'OrgSettings' },
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });

  it('should handle UPDATE_P_TARGETS', () => {
    expect(
      reducer(undefined, {
        type: 'UPDATE_P_TARGETS',
        payload: [{ name: 'test-target-plugin', content: 'plugin-new' }],
      })
    ).toEqual({
      targets: [
        { name: 'Dashboard', url: '/orgdash/id=undefined' },
        { name: 'People', url: '/orgpeople/id=undefined' },
        { name: 'Events', url: '/orgevents/id=undefined' },
        // { name: 'Contributions', url: '/orgcontribution/id=undefined' },
        { name: 'Posts', url: '/orgpost/id=undefined' },
        {
          name: 'Block/Unblock',
          url: '/blockuser/id=undefined',
        },
        {
          comp_id: null,
          component: null,
          name: 'Plugins',
          subTargets: [
            { name: 'test-target-plugin', content: 'plugin-new' },
            {
              icon: 'fa-store',
              name: 'Plugin Store',
              url: '/orgstore/id=undefined',
            },
          ],
        },
      ],
      configUrl: 'undefined',
      components: [
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
          name: 'Events',
          comp_id: 'orgevents',
          component: 'OrganizationEvents',
        },
        // {
        //   name: 'Contributions',
        //   comp_id: 'orgcontribution',
        //   component: 'OrgContribution',
        // },
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
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
        { name: '', comp_id: 'orglist', component: 'OrgList' },
        { name: '', comp_id: 'orgsetting', component: 'OrgSettings' },
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });
});
