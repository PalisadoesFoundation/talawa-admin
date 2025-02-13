import type React from 'react';

export interface InterfaceAddOnProps {
  extras?: Record<string, unknown>;
  name?: string;
  children?: React.ReactNode;
}

export interface InterfaceAddOnEntryProps {
  id: string;
  enabled?: boolean; // Optional props
  title?: string; // Optional props
  description?: string; // Optional props
  createdBy: string;
  component?: string; // Optional props
  modified?: boolean; // Optional props
  uninstalledOrgs: string[];
  getInstalledPlugins: () => void;
}

export interface InterfaceFormStateTypes {
  pluginName: string;
  pluginCreatedBy: string;
  pluginDesc: string;
  pluginInstallStatus: boolean;
  installedOrgs: [string] | [];
}

export interface InterfaceAddOnRegisterProps {
  createdBy?: string;
}

export interface InterfacePluginHelper {
  _id: string;
  pluginName?: string;
  pluginDesc?: string;
  pluginCreatedBy: string;
  pluginInstallStatus?: boolean;
  uninstalledOrgs: string[];
  installed: boolean;
  enabled: boolean;
  name: string;
  component: string;
}

export interface InterfacePlugin {
  enabled: boolean;
  pluginName: string;
  component: string;
}

export interface InterfaceActionProps {
  /**
   * The child elements to be rendered inside the action component.
   */
  children: React.ReactNode;

  /**
   * The label to be displayed above the child elements.
   */
  label: string;
}

export interface InterfaceMainContentProps {
  /**
   * The child elements to be rendered inside the main content container.
   */
  children: React.ReactNode;
}

export interface InterfaceSidePanelProps {
  /**
   * Whether the side panel should be collapsed.
   */
  collapse?: boolean;

  /**
   * The child elements to be rendered inside the side panel.
   */
  children: React.ReactNode;
}
