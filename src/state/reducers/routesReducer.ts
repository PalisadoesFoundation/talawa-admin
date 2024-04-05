import type { InterfaceAction } from 'state/helpers/Action';

<<<<<<< HEAD
const reducer = (
  state = INITIAL_STATE,
  action: InterfaceAction,
=======
const currentOrg = window.location.href.split('=')[1];

const reducer = (
  state = INITIAL_STATE,
  action: InterfaceAction
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
): typeof INITIAL_STATE => {
  switch (action.type) {
    case 'UPDATE_TARGETS': {
      return Object.assign({}, INITIAL_STATE, {
<<<<<<< HEAD
        targets: [...generateRoutes(components, action.payload)],
=======
        targets: [...INITIAL_STATE.targets, action.payload],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      });
    }
    case 'UPDATE_P_TARGETS': {
      const oldTargets: any = INITIAL_STATE.targets.filter(
<<<<<<< HEAD
        (target: any) => target.name === 'Plugins',
=======
        (target: any) => target.name === 'Plugins'
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      )[0].subTargets;
      return Object.assign({}, INITIAL_STATE, {
        targets: [
          ...INITIAL_STATE.targets.filter(
<<<<<<< HEAD
            (target: any) => target.name !== 'Plugins',
=======
            (target: any) => target.name !== 'Plugins'
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          ),
          Object.assign(
            {},
            {
              name: 'Plugins',
              comp_id: null,
              component: null,
              subTargets: [...action.payload, ...oldTargets],
<<<<<<< HEAD
            },
=======
            }
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          ),
        ],
      });
    }
    default: {
      return state;
    }
  }
};

export type ComponentType = {
  name: string;
  comp_id: string | null;
  component: string | null;
  subTargets?: {
    name: string;
    comp_id: string;
    component: string;
    icon?: string;
  }[];
};

export type TargetsType = {
  name: string;
  url?: string;
  subTargets?: {
    name: any;
    url: string;
    icon: any;
  }[];
};

// Note: Routes with names appear on NavBar
const components: ComponentType[] = [
<<<<<<< HEAD
  { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
  { name: 'Dashboard', comp_id: 'orgdash', component: 'OrganizationDashboard' },
  { name: 'People', comp_id: 'orgpeople', component: 'OrganizationPeople' },
  { name: 'Events', comp_id: 'orgevents', component: 'OrganizationEvents' },
  { name: 'Venues', comp_id: 'orgvenues', component: 'OrganizationVenues' },
  {
    name: 'Action Items',
    comp_id: 'orgactionitems',
    component: 'OrganizationActionItems',
  },
  { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
  { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
  { name: 'Advertisement', comp_id: 'orgads', component: 'Advertisements' },
  { name: 'Funds', comp_id: 'orgfunds', component: 'OrganizationFunds' },
=======
  { name: 'Dashboard', comp_id: 'orgdash', component: 'OrganizationDashboard' },
  { name: 'People', comp_id: 'orgpeople', component: 'OrganizationPeople' },
  { name: 'Events', comp_id: 'orgevents', component: 'OrganizationEvents' },
  { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
  { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
  { name: 'Advertisement', comp_id: 'orgads', component: 'Advertisements' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
  { name: 'Settings', comp_id: 'orgsetting', component: 'OrgSettings' },
  { name: '', comp_id: 'member', component: 'MemberDetail' },
];

const generateRoutes = (
  comps: ComponentType[],
  currentOrg = undefined,
): TargetsType[] => {
=======

  { name: 'Settings', comp_id: 'orgsetting', component: 'OrgSettings' },
  { name: 'All Organizations', comp_id: 'orglist', component: 'OrgList' },
  { name: '', comp_id: 'member', component: 'MemberDetail' },
];

const generateRoutes = (comps: ComponentType[]): TargetsType[] => {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  return comps
    .filter((comp) => comp.name && comp.name !== '')
    .map((comp) => {
      const entry: TargetsType = comp.comp_id
<<<<<<< HEAD
        ? comp.comp_id === 'orglist'
          ? { name: comp.name, url: `/${comp.comp_id}` }
          : { name: comp.name, url: `/${comp.comp_id}/${currentOrg}` }
=======
        ? { name: comp.name, url: `/${comp.comp_id}/id=${currentOrg}` }
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        : {
            name: comp.name,
            subTargets: comp.subTargets?.map((subTarget: any) => {
              return {
                name: subTarget.name,
<<<<<<< HEAD
                url: `/${subTarget.comp_id}/${currentOrg}`,
=======
                url: `/${subTarget.comp_id}/id=${currentOrg}`,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                icon: subTarget.icon ? subTarget.icon : null,
              };
            }),
          };
      return entry;
    });
};

const INITIAL_STATE = {
  targets: generateRoutes(components),
<<<<<<< HEAD
=======
  configUrl: `${currentOrg}`,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  components,
};

export default reducer;
