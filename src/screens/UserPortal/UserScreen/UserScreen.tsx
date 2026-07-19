/**
 * UserScreen — user portal layout shell.
 *
 * Uses UserSidebar (dark, collapsible) and Topbar. Manages org context
 * and Redux route targets. Shows org-specific or global nav depending
 * on whether orgId is in the URL.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { InterfaceMapType } from 'utils/interfaces';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import UserSidebarComponent from 'components/Layout/UserSidebar/UserSidebar';
import Topbar from 'components/Layout/Topbar/Topbar';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import { IOrganizationData } from 'types/shared-components/SidebarOrgSection/interface';
import { useQuery } from '@apollo/client';

const map: InterfaceMapType = {
  organization: 'home',
  people: 'people',
  events: 'userEvents',
  donate: 'donate',
  transactions: 'transactions',
  chat: 'userChat',
  campaigns: 'userCampaigns',
  pledges: 'userPledges',
  volunteer: 'userVolunteer',
  leaveorg: 'leaveOrganization',
  notification: 'notification',
  organizations: 'userOrganizations',
  settings: 'settings',
};

const UserScreen = (): React.JSX.Element => {
  const location = useLocation();
  const { getItem, setItem } = useLocalStorage();
  const { orgId } = useParams();
  const dispatch = useAppDispatch();

  const titleKey: string = map[location.pathname.split('/')[2]] || 'common';
  const { t: tScoped } = useTranslation('translation', {
    keyPrefix: titleKey,
  });

  const userRoutes: { targets: TargetsType[] } = useSelector(
    (state: RootState) => state.userRoutes,
  );
  const { targets } = userRoutes;

  const { data: orgData } = useQuery<{
    organization: IOrganizationData;
  }>(GET_ORGANIZATION_BASIC_DATA, {
    variables: { id: orgId },
  });

  // Sidebar state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return getItem('sidebarCollapsed') === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      setItem('sidebarCollapsed', next.toString());
      document.body.classList.toggle('sidebar-collapsed', next);
      return next;
    });
  }, [setItem]);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handleOpenMobile = useCallback(() => {
    setMobileOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // Update Redux targets when org changes
  useEffect(() => {
    if (orgId) {
      dispatch(updateTargets(orgId));
    }
  }, [orgId, dispatch]);

  // Sync body class
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
  }, [collapsed]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <UserSidebarComponent
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
        orgName={orgData?.organization?.name ?? ''}
        avatarURL={orgData?.organization?.avatarURL ?? ''}
      />

      <Topbar title={tScoped('title')} onHamburgerClick={handleOpenMobile} />

      <main id="main-content" className="main" data-testid="mainpageright">
        <Outlet />
      </main>
    </>
  );
};

export default UserScreen;
