import type { InterfaceAction } from 'state/helpers/Action';
import { ROUTE_USER, ROUTE_USER_ORG } from 'Constant/common';

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
  state = INITIAL_USER_STATE,
  action: InterfaceAction,
): typeof INITIAL_USER_STATE => {
  switch (action.type) {
    case 'UPDATE_TARGETS': {
      return Object.assign({}, state, {
        targets: [...generateRoutes(components, action.payload as string)],
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
  {
    name: 'My Organizations',
    comp_id: 'organizations',
    component: 'Organizations',
  },
  {
    name: 'Posts',
    comp_id: 'organization',
    component: 'Posts',
  },
  { name: 'Chat', comp_id: 'chat', component: 'Chat' },
  { name: 'Events', comp_id: 'events', component: 'Events' },
  { name: 'Volunteer', comp_id: 'volunteer', component: 'VolunteerManagement' },
  { name: 'People', comp_id: 'people', component: 'People' },
  { name: 'Donate', comp_id: 'donate', component: 'Donate' },
  {
    name: 'Campaigns',
    comp_id: 'campaigns',
    component: 'Campaigns',
  },
  { name: 'My Pledges', comp_id: 'pledges', component: 'Pledges' },
  { name: 'Transactions', comp_id: 'transactions', component: 'Transactions' },
  {
    name: 'Leave Organization',
    comp_id: 'leaveorg',
    component: 'LeaveOrganization',
  },
];

const generateRoutes = (
  comps: ComponentType[],
  currentOrg?: string,
): TargetsType[] => {
  return comps
    .filter((comp) => comp.name && comp.name !== '' && comp.comp_id)
    .map((comp) => {
      const entry: TargetsType =
        comp.comp_id === 'organizations'
          ? {
              name: comp.name,
              url: ROUTE_USER(comp.comp_id as string),
            }
          : {
              name: comp.name,
              url: ROUTE_USER_ORG(comp.comp_id as string, currentOrg),
            };
      return entry;
    });
};

const INITIAL_USER_STATE = {
  targets: generateRoutes(components),
  components,
};

export default reducer;
