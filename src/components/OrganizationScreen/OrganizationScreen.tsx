/**
 * OrganizationScreen Component
 *
 * This component serves as the main screen for managing an organization.
 * It includes a side drawer for navigation, a header with a title and profile dropdown,
 * and dynamically renders child routes using React Router's `Outlet`.
 *
 * @remarks
 * - The component uses Redux for state management and Apollo Client for GraphQL queries.
 * - It dynamically updates the page title and event name based on the current route.
 * - The side drawer visibility is responsive to screen resizing.
 *
 * @returns  The rendered OrganizationScreen component.
 *
 * @example
 * ```tsx
 * <OrganizationScreen />
 * ```
 *
 */
import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Navigate,
  Outlet,
  useLocation,
  useParams,
  useMatch,
} from 'react-router';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from 'style/app-fixed.module.css';
import type { InterfaceMapType } from 'utils/interfaces';
import { useQuery } from '@apollo/client';
import { GET_ORGANIZATION_EVENTS_PG } from 'GraphQl/Queries/Queries';
import type { InterfaceEvent } from 'types/Event/interface';
import useLocalStorage from 'utils/useLocalstorage';

const OrganizationScreen = (): JSX.Element => {
  const { getItem, setItem } = useLocalStorage();
  // State to manage visibility of the side drawer
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });
  // Get the current location to determine the translation key
  const location = useLocation();
  const titleKey: string | undefined = map[location.pathname.split('/')[1]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });

  // Get the organization ID from the URL parameters
  const { orgId } = useParams();
  const [eventName, setEventName] = useState<string | null>(null);

  const isEventPath = useMatch('/event/:orgId/:eventId');

  // Get the application routes from the Redux store
  const appRoutes: { targets: TargetsType[] } = useSelector(
    (state: RootState) => state.appRoutes,
  );
  const { targets } = appRoutes;

  const dispatch = useAppDispatch();

  const { data: eventsData } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: { id: orgId },
  });

  // Update targets whenever the organization ID changes
  useEffect(() => {
    if (orgId) {
      dispatch(updateTargets(orgId));
    }
  }, [orgId, dispatch]);

  useEffect(() => {
    setItem('sidebar', hideDrawer.toString());
  }, [hideDrawer, setItem]);

  // If no organization ID is found, navigate back to the home page
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  useEffect(() => {
    if (isEventPath?.params.eventId && eventsData?.eventsByOrganization) {
      const eventId = isEventPath.params.eventId;
      const event = eventsData.eventsByOrganization.find(
        (e: InterfaceEvent) => e._id === eventId,
      );

      if (!event) {
        console.warn(`Event with id ${eventId} not found`);
        setEventName(null);
        return;
      }
      setEventName(event.title);
    } else {
      setEventName(null);
    }
  }, [isEventPath, eventsData]);

  // Handle screen resizing to show/hide the side drawer
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(!hideDrawer);
    }
  };

  // Set up event listener for window resize
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className={styles.opendrawerdrawer}>
        <LeftDrawerOrg
          orgId={orgId}
          targets={targets}
          hideDrawer={hideDrawer}
          setHideDrawer={setHideDrawer}
        />
      </div>
      <div
        className={`${hideDrawer ? styles.expand : styles.contract}`}
        data-testid="mainpageright"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ flex: 1 }}>
            <h1>{t('title')}</h1>
            {eventName && <h4 className="">{eventName}</h4>}
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default OrganizationScreen;

/**
 * Mapping object to get translation keys based on route
 */
const map: InterfaceMapType = {
  orgdash: 'dashboard',
  orgpeople: 'organizationPeople',
  orgtags: 'organizationTags',
  requests: 'requests',
  orgads: 'advertisement',
  member: 'memberDetail',
  orgevents: 'organizationEvents',
  orgactionitems: 'organizationActionItems',
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
};
