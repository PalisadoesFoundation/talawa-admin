import { Action } from 'state/helpers/Action';

const currentOrg = window.location.href.split('=')[1];

const reducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case 'UPDATE_TARGETS': {
      return Object.assign({}, INITIAL_STATE, {
        targets: [...INITIAL_STATE.targets, action.payload],
      });
    }
    case 'UPDATE_P_TARGETS': {
      const oldTargets: any = INITIAL_STATE.targets.filter(
        (target: any) => target.name === 'Plugins'
      )[0].subTargets;
      return Object.assign({}, INITIAL_STATE, {
        targets: [
          ...INITIAL_STATE.targets.filter(
            (target: any) => target.name !== 'Plugins'
          ),
          Object.assign(
            {},
            {
              name: 'Plugins',
              comp_id: null,
              component: null,
              subTargets: [...action.payload, ...oldTargets],
            }
          ),
        ],
      });
    }
    default: {
      return state;
    }
  }
};

// Note: Routes with names appear on NavBar
const components = [
  { name: 'Dashboard', comp_id: 'orgdash', component: 'OrganizationDashboard' },
  { name: 'People', comp_id: 'orgpeople', component: 'OrganizationPeople' },
  { name: 'Events', comp_id: 'orgevents', component: 'OrganizationEvents' },
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
    component: 'AddOnStore', // Default
    subTargets: [
      {
        name: 'Plugin Store',
        comp_id: 'orgstore',
        component: 'AddOnStore',
        icon: 'fa-store',
      },
    ],
  },
  { name: '', comp_id: 'orglist', component: 'OrgList' },
  { name: '', comp_id: 'orgsetting', component: 'OrgSettings' },
];

const generateRoutes = (comps: any[]) => {
  return comps
    .filter((comp) => comp.name && comp.name !== '')
    .map((comp) => {
      const entry = comp.comp_id
        ? { name: comp.name, url: `/${comp.comp_id}/id=${currentOrg}` }
        : {
            name: comp.name,
            subTargets: comp.subTargets.map((subTarget: any) => {
              return {
                name: subTarget.name,
                url: `/${subTarget.comp_id}/id=${currentOrg}`,
                icon: subTarget.icon ? subTarget.icon : null,
              };
            }),
          };
      return entry;
    });
};

const INITIAL_STATE: any = {
  targets: generateRoutes(components),
  configUrl: `${currentOrg}`,
  components,
};

export default reducer;
