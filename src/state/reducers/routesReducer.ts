import type { InterfaceAction } from 'state/helpers/Action';

const currentOrg = window.location.href.split('=')[1];

const reducer = (
  state = INITIAL_STATE,
  action: InterfaceAction,
): typeof INITIAL_STATE => {
  switch (action.type) {
    case 'UPDATE_TARGETS': {
      return Object.assign({}, INITIAL_STATE, {
        targets: [...INITIAL_STATE.targets, action.payload],
      });
    }
    case 'UPDATE_P_TARGETS': {
      const oldTargets: any = INITIAL_STATE.targets.filter(
        (target: any) => target.name === 'Plugins',
      )[0].subTargets;
      return Object.assign({}, INITIAL_STATE, {
        targets: [
          ...INITIAL_STATE.targets.filter(
            (target: any) => target.name !== 'Plugins',
          ),
          Object.assign(
            {},
            {
              name: 'Plugins',
              comp_id: null,
              component: null,
              subTargets: [...action.payload, ...oldTargets],
            },
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
  { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
  { name: 'Dashboard', comp_id: 'orgdash', component: 'OrganizationDashboard' },
  { name: 'People', comp_id: 'orgpeople', component: 'OrganizationPeople' },
  { name: 'Events', comp_id: 'orgevents', component: 'OrganizationEvents' },
  {
    name: 'Action Items',
    comp_id: 'orgactionitems',
    component: 'OrganizationActionItems',
  },
  { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
  { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
  { name: 'Advertisement', comp_id: 'orgads', component: 'Advertisements' },
  { name: 'Funds', comp_id: 'orgfunds', component: 'Advertisements' },
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
  { name: 'Settings', comp_id: 'orgsetting', component: 'OrgSettings' },
  { name: '', comp_id: 'member', component: 'MemberDetail' },
];

const generateRoutes = (comps: ComponentType[]): TargetsType[] => {
  return comps
    .filter((comp) => comp.name && comp.name !== '')
    .map((comp) => {
      const entry: TargetsType = comp.comp_id
        ? { name: comp.name, url: `/${comp.comp_id}/id=${currentOrg}` }
        : {
            name: comp.name,
            subTargets: comp.subTargets?.map((subTarget: any) => {
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

const INITIAL_STATE = {
  targets: generateRoutes(components),
  configUrl: `${currentOrg}`,
  components,
};

export default reducer;
