import React, { useEffect, useState } from 'react';
import { usePluginDrawerItems } from '../../hooks/usePluginDrawerItems';
import { useUserPermissions } from '../../contexts/UserPermissionsContext';

const LeftDrawerOrg: React.FC = () => {
  const userPermissions = useUserPermissions();

  // Get plugin drawer items for org admin (org-specific only)
  const pluginDrawerItems = usePluginDrawerItems(userPermissions, true, true);

  return <div>{/* Render your drawer items here */}</div>;
};

export default LeftDrawerOrg;
