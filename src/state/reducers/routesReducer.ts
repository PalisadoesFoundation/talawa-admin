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
        targets: [
          ...generateRoutes(components, action.payload as string | undefined),
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
  { name: 'myOrganizations', comp_id: 'orglist', component: 'OrgList' },
  { name: 'dashboard', comp_id: 'orgdash', component: 'OrganizationDashboard' },
  { name: 'posts', comp_id: 'orgpost', component: 'OrgPost' },
  { name: 'chat', comp_id: 'orgchat', component: 'Chat' },
  { name: 'events', comp_id: 'orgevents', component: 'OrganizationEvents' },
  { name: 'people', comp_id: 'orgpeople', component: 'OrganizationPeople' },
  { name: 'tags', comp_id: 'orgtags', component: 'OrganizationTags' },
  { name: 'advertisement', comp_id: 'orgads', component: 'Advertisements' },
  { name: 'funds', comp_id: 'orgfunds', component: 'OrganizationFunds' },
  {
    name: 'transactions',
    comp_id: 'orgtransactions',
    component: 'OrganizationTransactions',
  },
  { name: 'membershipRequests', comp_id: 'requests', component: 'Requests' },
  { name: 'blockUnblock', comp_id: 'blockuser', component: 'BlockUser' },
  { name: 'venues', comp_id: 'orgvenues', component: 'OrganizationVenues' },
  { name: 'settings', comp_id: 'orgsetting', component: 'OrgSettings' },
  { name: '', comp_id: 'member', component: 'MemberDetail' },
];

const generateRoutes = (
  comps: ComponentType[],
  currentOrg?: string,
): TargetsType[] => {
  return comps
    .filter((comp) => comp.name && comp.name !== '')
    .map((comp) => {
      const entry: TargetsType = comp.comp_id
        ? comp.comp_id === 'orglist'
          ? { name: comp.name, url: `/admin/${comp.comp_id}` }
          : { name: comp.name, url: `/admin/${comp.comp_id}/${currentOrg}` }
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
                  url: `/admin/${subTarget.comp_id}/${currentOrg}`,
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

export { generateRoutes };
export default reducer;
