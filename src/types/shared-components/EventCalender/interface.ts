import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';

export interface IEventHeaderProps {
  viewType: ViewType;
  handleChangeView: (item: string | null) => void;
  showInviteModal: () => void;
}

export type InterfaceEventHeaderProps = IEventHeaderProps;
