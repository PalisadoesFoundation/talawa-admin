/**
 * OrganizationScreen Component
 *
 * This component serves as the main screen for managing an organization.
 * It includes a side drawer for navigation, a header with a title and profile dropdown,
 * and dynamically renders child routes using React Router's `Outlet`.
 *
 * @component
 *
 * @remarks
 * - The component uses Redux for state management and Apollo Client for GraphQL queries.
 * - It dynamically updates the page title and event name based on the current route.
 * - The side drawer visibility is responsive to screen resizing.
 *
 * @returns {JSX.Element} The rendered OrganizationScreen component.
 *
 * @example
 * ```tsx
 * <OrganizationScreen />
 * ```
 *
 * @dependencies
 * - `useLocation`, `useParams`, `useMatch`, `Navigate`, and `Outlet` from `react-router-dom`
 * - `useSelector` and `useAppDispatch` for Redux state management
 * - `useQuery` from `@apollo/client` for fetching organization events
 * - `useTranslation` from `react-i18next` for internationalization
 *
 * @state
 * - `hideDrawer` (`boolean | null`): Manages the visibility of the side drawer.
 * - `eventName` (`string | null`): Stores the name of the currently selected event.
 *
 * @redux
 * - `appRoutes.targets`: Contains the application routes for the organization.
 * - Dispatches `updateTargets` action to update targets based on the organization ID.
 *
 * @graphql
 * - Query: `ORGANIZATION_EVENT_LIST` to fetch events for the organization.
 *
 * @hooks
 * - `useEffect`: Handles side drawer visibility, updates targets, and sets the event name.
 * - `useQuery`: Fetches organization events data.
 *
 * @styles
 * - Uses CSS modules for styling (`app-fixed.module.css`).
 *
 * @translation
 * - Dynamically sets the page title using `useTranslation` and a mapping object.
 *
 * @events
 * - Listens to window resize events to toggle the side drawer visibility.
 */
import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Navigate,
  Outlet,
  useLocation,
  useParams,
  useMatch,
} from 'react-router-dom';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from 'style/app-fixed.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';
import type { InterfaceMapType } from 'utils/interfaces';
import { useQuery } from '@apollo/client';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';
import type { InterfaceEvent } from 'types/Event/interface';

const OrganizationScreen = (): JSX.Element => {
  // Get the current location to determine the translation key
  const location = useLocation();
  const titleKey: string | undefined = map[location.pathname.split('/')[1]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });

  // State to manage visibility of the side drawer
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

  // Get the organization ID from the URL parameters
  const { orgId } = useParams();
  const [eventName, setEventName] = useState<string | null>(null);

  const isEventPath = useMatch('/event/:orgId/:eventId');

  // If no organization ID is found, navigate back to the home page
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  // Get the application routes from the Redux store
  const appRoutes: { targets: TargetsType[] } = useSelector(
    (state: RootState) => state.appRoutes,
  );
  const { targets } = appRoutes;

  const dispatch = useAppDispatch();

  // Update targets whenever the organization ID changes
  useEffect(() => {
    dispatch(updateTargets(orgId));
  }, [orgId]);

  const { data: eventsData } = useQuery(ORGANIZATION_EVENT_LIST, {
    variables: { id: orgId },
  });

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
        className={`${styles.pageContainer} ${
          hideDrawer === null
            ? ''
            : hideDrawer
              ? styles.expand
              : styles.contract
        } `}
        data-testid="mainpageright"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ flex: 1 }}>
            <h1>{t('title')}</h1>
            {eventName && <h4 className="">{eventName}</h4>}
          </div>
          <ProfileDropdown />
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
  orgfundcampaign: 'fundCampaign',
  fundCampaignPledge: 'pledges',
  orgsetting: 'orgSettings',
  orgstore: 'addOnStore',
  blockuser: 'blockUnblockUser',
  orgvenues: 'organizationVenues',
  event: 'eventManagement',
  leaderboard: 'leaderboard',
};
