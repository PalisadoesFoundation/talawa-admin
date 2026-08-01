/**
 * OrganizationScreen — org-level admin layout shell.
 *
 * Uses AdminSidebar (org variant) and Topbar. Manages org context,
 * event name resolution, and Redux route targets.
 */

import React, { useEffect, useState, useCallback } from 'react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigate,
  Outlet,
  useLocation,
  useParams,
  useMatch,
} from 'react-router';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { InterfaceMapType } from 'utils/interfaces';
import { useQuery } from '@apollo/client';
import {
  GET_ORGANIZATION_BASIC_DATA,
  GET_ORGANIZATION_EVENTS_PG,
} from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import AdminSidebar from 'components/Layout/AdminSidebar/AdminSidebar';
import Topbar from 'components/Layout/Topbar/Topbar';
import type { IOrganizationData } from 'types/shared-components/SidebarOrgSection/interface';

const OrganizationScreen = (): JSX.Element => {
  const { getItem, setItem } = useLocalStorage();
  const location = useLocation();
  const titleKey: string | undefined =
    translationKeyMap[location.pathname.split('/')[2]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });

  const { orgId } = useParams();
  const [eventName, setEventName] = useState<string | null>(null);

  const isEventPath = useMatch('/admin/event/:orgId/:eventId');
  const eventId = isEventPath?.params.eventId;
  const shouldFetchEventName = Boolean(orgId && eventId);
  const EVENTS_PAGE_SIZE = 100;

  const dispatch = useAppDispatch();

  // Sidebar collapse state
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

  // Event name query
  const { data: eventsData } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: orgId ?? '',
      first: EVENTS_PAGE_SIZE,
      after: null,
    },
    skip: !shouldFetchEventName,
  });

  const { data: orgData } = useQuery<{
    organization: IOrganizationData;
  }>(GET_ORGANIZATION_BASIC_DATA, {
    variables: { id: orgId },
  });

  // Update Redux targets when org changes
  useEffect(() => {
    if (orgId) {
      dispatch(updateTargets(orgId));
    }
  }, [orgId, dispatch]);

  // Sync body class on mount
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
  }, [collapsed]);

  // Redirect if no org
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  // Resolve event name
  useEffect(() => {
    if (!eventId) {
      setEventName(null);
      return;
    }
    if (!eventsData?.organization?.events) {
      return;
    }
    const edges = eventsData.organization.events.edges ?? [];
    const matched = edges.find((edge: { node?: { id?: string } }) => {
      return edge?.node?.id === eventId;
    });
    if (!matched?.node?.id) {
      NotificationToast.warning({
        key: 'eventNotFound',
        namespace: 'common',
        values: { id: eventId },
      });
      setEventName(null);
      return;
    }
    setEventName(matched.node.name ?? null);
  }, [eventId, eventsData]);

  const pageTitle = eventName ? `${t('title')} — ${eventName}` : t('title');

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AdminSidebar
        variant="org"
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
        orgName={orgData?.organization?.name ?? ''}
        avatarURL={orgData?.organization?.avatarURL ?? ''}
      />

      <Topbar title={pageTitle} onHamburgerClick={handleOpenMobile} />

      <main id="main-content" className="main" data-testid="mainpageright">
        <Outlet />
      </main>
    </>
  );
};

export default OrganizationScreen;

/**
 * Mapping object to get translation keys based on route
 */
export const translationKeyMap: InterfaceMapType = {
  orgdash: 'dashboard',
  orgpeople: 'organizationPeople',
  orgtags: 'organizationTags',
  requests: 'requests',
  orgads: 'advertisement',
  member: 'memberDetail',
  orgevents: 'organizationEvents',
  orgagendacategory: 'organizationAgendaCategory',
  orgcontribution: 'orgContribution',
  orgpost: 'orgPost',
  orgfunds: 'funds',
  orgtransactions: 'transactions',
  orgfundcampaign: 'fundCampaign',
  fundCampaignPledge: 'pledges',
  orgsetting: 'orgSettings',
  orgstore: 'addOnStore',
  blockuser: 'blockUnblockUser',
  orgvenues: 'organizationVenues',
  event: 'eventManagement',
  leaderboard: 'leaderboard',
  orgchat: 'userChat',
};
