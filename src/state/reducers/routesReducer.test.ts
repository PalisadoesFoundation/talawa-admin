import reducer from './routesReducer';
// import * as types from '../actions/posts/getPostsReduxAction';
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
        { name: 'Contributions', url: '/orgcontribution/id=undefined' },
        { name: 'Posts', url: '/orgpost/id=undefined' },
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
      configUrl: '/orgsetting/id=undefined',
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
        {
          name: 'Contributions',
          comp_id: 'orgcontribution',
          component: 'OrgContribution',
        },
        { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
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
      ],
    });
  });
  test.todo('should handle UPDATE_TARGETS');
  test.todo('should handle UPDATE_P_TARGETS');
  test.todo('should handle GET_POST_FAIL');
  test.todo('should handle GET_POST_START');
});
