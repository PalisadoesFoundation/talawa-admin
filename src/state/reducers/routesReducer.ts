import type { InterfaceAction } from 'state/helpers/Action';

export type TargetsType = {
  name: string;
  url?: string;
  subTargets?: SubTargetType[];
};

export type SubTargetType = {
  name?: string;
  url: string;
  icon?: string;
  comp_id?: string;
};

const reducer = (
  state = INITIAL_STATE,
  action: InterfaceAction,
): typeof INITIAL_STATE => {
  switch (action.type) {
    case 'UPDATE_TARGETS': {
      return Object.assign({}, state, {
        targets: [...generateRoutes(components, action.payload)],
      });
    }
    case 'UPDATE_P_TARGETS': {
      const filteredTargets = state.targets.filter(
        (target: TargetsType) => target.name === 'Plugins',
      );

      const oldTargets: SubTargetType[] = filteredTargets[0]?.subTargets || [];
      return Object.assign({}, state, {
        targets: [
          ...state.targets.filter(
            (target: TargetsType) => target.name !== 'Plugins',
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

// Note: Routes with names appear on NavBar
const components: ComponentType[] = [
  { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
  { name: 'Dashboard', comp_id: 'orgdash', component: 'OrganizationDashboard' },
  { name: 'People', comp_id: 'orgpeople', component: 'OrganizationPeople' },
  { name: 'Tags', comp_id: 'orgtags', component: 'OrganizationTags' },
  { name: 'Events', comp_id: 'orgevents', component: 'OrganizationEvents' },
  { name: 'Venues', comp_id: 'orgvenues', component: 'OrganizationVenues' },
  {
    name: 'Action Items',
    comp_id: 'orgactionitems',
    component: 'OrganizationActionItems',
  },
  {
    name: 'Agenda Items Category',
    comp_id: 'orgagendacategory',
    component: 'OrganizationAgendaCategory',
  },
  { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
  { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
  { name: 'Advertisement', comp_id: 'orgads', component: 'Advertisements' },
  { name: 'Funds', comp_id: 'orgfunds', component: 'OrganizationFunds' },
  { name: 'Membership Requests', comp_id: 'requests', component: 'Requests' },
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

const generateRoutes = (
  comps: ComponentType[],
  currentOrg = undefined,
): TargetsType[] => {
  return comps
    .filter((comp) => comp.name && comp.name !== '')
    .map((comp) => {
      const entry: TargetsType = comp.comp_id
        ? comp.comp_id === 'orglist'
          ? { name: comp.name, url: `/${comp.comp_id}` }
          : { name: comp.name, url: `/${comp.comp_id}/${currentOrg}` }
        : {
            name: comp.name,
            subTargets: comp.subTargets?.map(
              (subTarget: {
                name: string;
                comp_id: string;
                component: string;
                icon?: string;
              }) => {
                return {
                  name: subTarget.name,
                  url: `/${subTarget.comp_id}/${currentOrg}`,
                  icon: subTarget.icon,
                };
              },
            ),
          };
      return entry;
    });
};

const INITIAL_STATE = {
  targets: generateRoutes(components),
  components,
};

export default reducer;
