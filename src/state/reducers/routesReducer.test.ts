<<<<<<< HEAD
import expect from 'expect';
import reducer from './routesReducer';
=======
import reducer from './routesReducer';
import expect from 'expect';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

describe('Testing Routes reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {
        type: '',
        payload: undefined,
<<<<<<< HEAD
      }),
    ).toEqual({
      targets: [
        { name: 'My Organizations', url: '/orglist' },
        { name: 'Dashboard', url: '/orgdash/undefined' },
        { name: 'People', url: '/orgpeople/undefined' },
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
=======
      })
    ).toEqual({
      targets: [
        { name: 'Dashboard', url: '/orgdash/id=undefined' },
        { name: 'People', url: '/orgpeople/id=undefined' },
        { name: 'Events', url: '/orgevents/id=undefined' },
        { name: 'Posts', url: '/orgpost/id=undefined' },
        {
          name: 'Block/Unblock',
          url: '/blockuser/id=undefined',
        },
        { name: 'Advertisement', url: '/orgads/id=undefined' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        {
          name: 'Plugins',
          subTargets: [
            {
              icon: 'fa-store',
              name: 'Plugin Store',
<<<<<<< HEAD
              url: '/orgstore/undefined',
            },
          ],
        },
        { name: 'Settings', url: '/orgsetting/undefined' },
      ],
      components: [
        { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
=======
              url: '/orgstore/id=undefined',
            },
          ],
        },
        { name: 'Settings', url: '/orgsetting/id=undefined' },
        { name: 'All Organizations', url: '/orglist/id=undefined' },
      ],
      configUrl: 'undefined',
      components: [
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
        {
          name: 'Advertisement',
          comp_id: 'orgads',
          component: 'Advertisements',
        },
        {
<<<<<<< HEAD
          name: 'Funds',
          comp_id: 'orgfunds',
          component: 'OrganizationFunds',
        },
        {
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======
        { name: 'All Organizations', comp_id: 'orglist', component: 'OrgList' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });

  it('should handle UPDATE_TARGETS', () => {
    expect(
      reducer(undefined, {
        type: 'UPDATE_TARGETS',
<<<<<<< HEAD
        payload: 'orgId',
      }),
    ).toEqual({
      targets: [
        { name: 'My Organizations', url: '/orglist' },
        { name: 'Dashboard', url: '/orgdash/orgId' },
        { name: 'People', url: '/orgpeople/orgId' },
        { name: 'Events', url: '/orgevents/orgId' },
        { name: 'Venues', url: '/orgvenues/orgId' },
        { name: 'Action Items', url: '/orgactionitems/orgId' },
        { name: 'Posts', url: '/orgpost/orgId' },
        { name: 'Block/Unblock', url: '/blockuser/orgId' },
        { name: 'Advertisement', url: '/orgads/orgId' },
        { name: 'Funds', url: '/orgfunds/orgId' },
=======
        payload: { test: 'testupdate' },
      })
    ).toEqual({
      targets: [
        { name: 'Dashboard', url: '/orgdash/id=undefined' },
        { name: 'People', url: '/orgpeople/id=undefined' },
        { name: 'Events', url: '/orgevents/id=undefined' },
        { name: 'Posts', url: '/orgpost/id=undefined' },
        { name: 'Block/Unblock', url: '/blockuser/id=undefined' },
        { name: 'Advertisement', url: '/orgads/id=undefined' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        {
          name: 'Plugins',
          subTargets: [
            {
              icon: 'fa-store',
              name: 'Plugin Store',
<<<<<<< HEAD
              url: '/orgstore/orgId',
            },
          ],
        },
        { name: 'Settings', url: '/orgsetting/orgId' },
      ],
      components: [
        { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
=======
              url: '/orgstore/id=undefined',
            },
          ],
        },
        { name: 'Settings', url: '/orgsetting/id=undefined' },
        { name: 'All Organizations', url: '/orglist/id=undefined' },
        { test: 'testupdate' },
      ],
      configUrl: 'undefined',
      components: [
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
        {
          name: 'Advertisement',
          comp_id: 'orgads',
          component: 'Advertisements',
        },
<<<<<<< HEAD
        { name: 'Funds', comp_id: 'orgfunds', component: 'OrganizationFunds' },
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======
        { name: 'All Organizations', comp_id: 'orglist', component: 'OrgList' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });

  it('should handle UPDATE_P_TARGETS', () => {
    expect(
      reducer(undefined, {
        type: 'UPDATE_P_TARGETS',
        payload: [{ name: 'test-target-plugin', content: 'plugin-new' }],
<<<<<<< HEAD
      }),
    ).toEqual({
      targets: [
        { name: 'My Organizations', url: '/orglist' },
        { name: 'Dashboard', url: '/orgdash/undefined' },
        { name: 'People', url: '/orgpeople/undefined' },
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
        { name: 'Settings', url: '/orgsetting/undefined' },
=======
      })
    ).toEqual({
      targets: [
        { name: 'Dashboard', url: '/orgdash/id=undefined' },
        { name: 'People', url: '/orgpeople/id=undefined' },
        { name: 'Events', url: '/orgevents/id=undefined' },
        { name: 'Posts', url: '/orgpost/id=undefined' },
        {
          name: 'Block/Unblock',
          url: '/blockuser/id=undefined',
        },
        { name: 'Advertisement', url: '/orgads/id=undefined' },
        { name: 'Settings', url: '/orgsetting/id=undefined' },
        { name: 'All Organizations', url: '/orglist/id=undefined' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        {
          comp_id: null,
          component: null,
          name: 'Plugins',
          subTargets: [
            { name: 'test-target-plugin', content: 'plugin-new' },
            {
              icon: 'fa-store',
              name: 'Plugin Store',
<<<<<<< HEAD
              url: '/orgstore/undefined',
=======
              url: '/orgstore/id=undefined',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
            },
          ],
        },
      ],
<<<<<<< HEAD
      components: [
        { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
=======
      configUrl: 'undefined',
      components: [
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
        { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
        {
          name: 'Advertisement',
          comp_id: 'orgads',
          component: 'Advertisements',
        },
        {
<<<<<<< HEAD
          name: 'Funds',
          comp_id: 'orgfunds',
          component: 'OrganizationFunds',
        },
        {
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======
        { name: 'All Organizations', comp_id: 'orglist', component: 'OrgList' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        { name: '', comp_id: 'member', component: 'MemberDetail' },
      ],
    });
  });
});
