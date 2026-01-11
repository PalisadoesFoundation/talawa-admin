import React, { lazy, Suspense, useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router';
import { useQuery, useApolloClient } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import SecuredRoute from 'components/SecuredRoute/SecuredRoute';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';
import OrganizationFundCampaign from 'screens/AdminPortal/OrganizationFundCampaign/OrganizationFundCampaigns';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import LoginPage from 'screens/LoginPage/LoginPage';
import { usePluginRoutes, PluginRouteRenderer } from 'plugin';
import { getPluginManager } from 'plugin/manager';
import { discoverAndRegisterAllPlugins } from 'plugin/registry';
import UserScreen from 'screens/UserPortal/UserScreen/UserScreen';
import UserGlobalScreen from 'screens/UserPortal/UserGlobalScreen/UserGlobalScreen';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import { NotificationToastContainer } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

const OrganizationScreen = lazy(
  () => import('components/AdminPortal/OrganizationScreen/OrganizationScreen'),
);
const PostsPage = lazy(() => import('shared-components/posts/posts'));

const SuperAdminScreen = lazy(
  () => import('components/AdminPortal/SuperAdminScreen/SuperAdminScreen'),
);
const BlockUser = lazy(() => import('screens/AdminPortal/BlockUser/BlockUser'));
const EventManagement = lazy(
  () => import('screens/AdminPortal/EventManagement/EventManagement'),
);
const ForgotPassword = lazy(
  () => import('screens/ForgotPassword/ForgotPassword'),
);
const MemberDetail = lazy(
  () => import('shared-components/ProfileForm/ProfileForm'),
);
const OrgContribution = lazy(
  () => import('screens/AdminPortal/OrgContribution/OrgContribution'),
);
const OrgList = lazy(() => import('screens/AdminPortal/OrgList/OrgList'));
const OrgSettings = lazy(
  () => import('screens/AdminPortal/OrgSettings/OrgSettings'),
);

const OrganizationDashboard = lazy(
  () =>
    import('screens/AdminPortal/OrganizationDashboard/OrganizationDashboard'),
);
const OrganizationEvents = lazy(
  () => import('screens/AdminPortal/OrganizationEvents/OrganizationEvents'),
);
const OrganizationFunds = lazy(
  () => import('screens/AdminPortal/OrganizationFunds/OrganizationFunds'),
);
const OrganizationTransactions = lazy(
  () =>
    import(
      'screens/AdminPortal/OrganizationTransactions/OrganizationTransactions'
    ),
);
const FundCampaignPledge = lazy(
  () => import('screens/AdminPortal/FundCampaignPledge/FundCampaignPledge'),
);
const OrganizationPeople = lazy(
  () => import('screens/AdminPortal/OrganizationPeople/OrganizationPeople'),
);
const OrganizationTags = lazy(
  () => import('screens/AdminPortal/OrganizationTags/OrganizationTags'),
);
const ManageTag = lazy(() => import('screens/AdminPortal/ManageTag/ManageTag'));
const SubTags = lazy(() => import('screens/AdminPortal/SubTags/SubTags'));
const Requests = lazy(() => import('screens/AdminPortal/Requests/Requests'));
const Users = lazy(() => import('screens/AdminPortal/Users/Users'));
const CommunityProfile = lazy(
  () => import('screens/AdminPortal/CommunityProfile/CommunityProfile'),
);
const OrganizationVenues = lazy(
  () => import('screens/AdminPortal/OrganizationVenues/OrganizationVenues'),
);
const Leaderboard = lazy(
  () => import('screens/AdminPortal/Leaderboard/Leaderboard'),
);
const Advertisements = lazy(
  () => import('components/AdminPortal/Advertisements/Advertisements'),
);
const Donate = lazy(() => import('screens/UserPortal/Donate/Donate'));
const Transactions = lazy(
  () => import('screens/UserPortal/Transactions/Transactions'),
);
const Events = lazy(() => import('screens/UserPortal/Events/Events'));
const Organizations = lazy(
  () => import('screens/UserPortal/Organizations/Organizations'),
);
const People = lazy(() => import('screens/UserPortal/People/People'));
const Chat = lazy(() => import('screens/UserPortal/Chat/Chat'));
const EventDashboardScreen = lazy(
  () => import('components/EventDashboardScreen/EventDashboardScreen'),
);
const AcceptInvitation = lazy(
  () => import('screens/Public/Invitation/AcceptInvitation'),
);
const Campaigns = lazy(() => import('screens/UserPortal/Campaigns/Campaigns'));
const Pledges = lazy(() => import('screens/UserPortal/Pledges/Pledges'));
const VolunteerManagement = lazy(
  () => import('screens/UserPortal/Volunteer/VolunteerManagement'),
);
const LeaveOrganization = lazy(
  () => import('screens/UserPortal/LeaveOrganization/LeaveOrganization'),
);
const Notification = lazy(
  () => import('screens/AdminPortal/Notification/Notification'),
);

const PluginStore = lazy(
  () => import('screens/AdminPortal/PluginStore/PluginStore'),
);

const { setItem } = useLocalStorage();

/**
 * This is the main function for our application. It sets up all the routes and components,
 * defining how the user can navigate through the app. The function uses React Router's `Routes`
 * and `Route` components to map different URL paths to corresponding screens and components.
 *
 * ## Important Details
 * - **UseEffect Hook**: This hook checks user authentication status using the `CHECK_AUTH` GraphQL query.
 * - **Routes**:
 *   - The root route ("/") takes the user to the `LoginPage`.
 *   - Protected routes are wrapped with the `SecuredRoute` component to ensure they are only accessible to authenticated users.
 *   - Admin and Super Admin routes allow access to organization and user management screens.
 *   - User portal routes allow end-users to interact with organizations, settings, chat, events, etc.
 *   - Plugin routes are dynamically added based on loaded plugins and user permissions.
 *
 * @returns  The rendered routes and components of the application.
 */

function App(): React.ReactElement {
  const { data, loading } = useQuery(CURRENT_USER);

  const { t } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const apolloClient = useApolloClient();

  // Get user permissions and admin status (memoized to prevent infinite loops)
  const userPermissions = useMemo(() => {
    return (
      data?.currentUser?.appUserProfile?.adminFor?.map(
        (org: { _id: string }) => org._id,
      ) || []
    );
  }, [data?.currentUser?.appUserProfile?.adminFor]);

  // Get plugin routes
  const adminGlobalPluginRoutes = usePluginRoutes(userPermissions, true, false);
  const adminOrgPluginRoutes = usePluginRoutes(userPermissions, true, true);
  const userOrgPluginRoutes = usePluginRoutes(userPermissions, false, true);
  const userGlobalPluginRoutes = usePluginRoutes(userPermissions, false, false);

  // Initialize plugin system on app startup
  useEffect(() => {
    const initializePlugins = async () => {
      try {
        // Set Apollo client for plugin manager
        getPluginManager().setApolloClient(apolloClient);

        // Initialize plugin manager
        await getPluginManager().initializePluginSystem();

        // Initialize plugin registry
        await discoverAndRegisterAllPlugins();
      } catch (error) {
        console.error('Failed to initialize plugin system:', error);
      }
    };

    initializePlugins();
  }, [apolloClient]);

  useEffect(() => {
    if (!loading && data?.currentUser) {
      const auth = data.currentUser;
      setItem('IsLoggedIn', 'TRUE');
      setItem('id', auth.id);
      setItem('name', auth.name);
      setItem('email', auth.emailAddress);
      // setItem('UserImage', auth.avatarURL|| "");
    }
  }, [data, loading, setItem]);

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Suspense
        fallback={
          <LoadingState isLoading={true} variant="spinner">
            <div />
          </LoadingState>
        }
      >
        <NotificationToastContainer />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/admin" element={<LoginPage />} />
          <Route element={<SecuredRoute />}>
            <Route element={<SuperAdminScreen />}>
              <Route path="/orglist" element={<OrgList />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/admin/profile" element={<MemberDetail />} />
              <Route path="/users" element={<Users />} />
              <Route path="/communityProfile" element={<CommunityProfile />} />
              <Route path="/pluginstore" element={<PluginStore />} />
              {/* Admin global plugin routes (e.g., settings) */}
              {adminGlobalPluginRoutes.map((route) => (
                <Route
                  key={`${route.pluginId}-${route.path}`}
                  path={route.path}
                  element={
                    <PluginRouteRenderer
                      route={route}
                      fallback={<div>{t('loadingAdminPlugin')}</div>}
                    />
                  }
                />
              ))}
            </Route>
            <Route element={<OrganizationScreen />}>
              <Route path="/requests/:orgId" element={<Requests />} />
              <Route
                path="/orgdash/:orgId"
                element={<OrganizationDashboard />}
              />
              <Route
                path="/orgpeople/:orgId"
                element={<OrganizationPeople />}
              />
              <Route path="/orgtags/:orgId" element={<OrganizationTags />} />
              <Route
                path="orgtags/:orgId/manageTag/:tagId"
                element={<ManageTag />}
              />
              <Route
                path="orgtags/:orgId/subTags/:tagId"
                element={<SubTags />}
              />
              <Route path="/member/:orgId/:userId" element={<MemberDetail />} />
              <Route
                path="/orgevents/:orgId"
                element={<OrganizationEvents />}
              />
              <Route
                path="/event/:orgId/:eventId"
                element={<EventManagement />}
              />

              <Route path="/orgfunds/:orgId" element={<OrganizationFunds />} />
              <Route
                path="/orgtransactions/:orgId"
                element={<OrganizationTransactions />}
              />
              <Route
                path="/orgfundcampaign/:orgId/:fundId"
                element={<OrganizationFundCampaign />}
              />
              <Route
                path="/fundCampaignPledge/:orgId/:fundCampaignId"
                element={<FundCampaignPledge />}
              />
              <Route path="/orgcontribution" element={<OrgContribution />} />
              <Route path="/orgpost/:orgId" element={<PostsPage />} />
              <Route path="/orgsetting/:orgId" element={<OrgSettings />} />
              <Route path="/orgads/:orgId" element={<Advertisements />} />
              <Route path="/blockuser/:orgId" element={<BlockUser />} />
              <Route
                path="/orgvenues/:orgId"
                element={<OrganizationVenues />}
              />
              <Route path="/leaderboard/:orgId" element={<Leaderboard />} />
              <Route path="/orgchat/:orgId" element={<Chat />} />
              {/* Admin org plugin routes */}
              {adminOrgPluginRoutes.map((route) => (
                <Route
                  key={`${route.pluginId}-${route.path}`}
                  path={route.path}
                  element={
                    <PluginRouteRenderer
                      route={route}
                      fallback={<div>{t('loadingAdminPlugin')}</div>}
                    />
                  }
                />
              ))}
            </Route>
          </Route>
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          {/* Public invitation accept route */}
          <Route
            path="/event/invitation/:token"
            element={<AcceptInvitation />}
          />
          {/* User Portal Routes */}
          <Route element={<SecuredRouteForUser />}>
            <Route path="/user/organizations" element={<Organizations />} />
            <Route path="/user/settings" element={<MemberDetail />} />
            {/* User global plugin routes (no orgId required) */}
            <Route element={<UserGlobalScreen />}>
              {userGlobalPluginRoutes.map((route) => (
                <Route
                  key={`${route.pluginId}-${route.path}`}
                  path={route.path}
                  element={
                    <PluginRouteRenderer
                      route={route}
                      fallback={<div>{t('loadingUserPlugin')}</div>}
                    />
                  }
                />
              ))}
            </Route>
            <Route element={<UserScreen />}>
              <Route path="/user/chat/:orgId" element={<Chat />} />
              <Route path="/user/organizations" element={<Organizations />} />
              <Route path="/user/organization/:orgId" element={<PostsPage />} />
              <Route path="/user/people/:orgId" element={<People />} />
              <Route path="/user/donate/:orgId" element={<Donate />} />
              <Route
                path="/user/transactions/:orgId"
                element={<Transactions />}
              />
              <Route path="/user/events/:orgId" element={<Events />} />
              <Route path="/user/campaigns/:orgId" element={<Campaigns />} />
              <Route path="/user/pledges/:orgId" element={<Pledges />} />
              <Route
                path="/user/leaveOrg/:orgId"
                element={<LeaveOrganization />}
              />
              <Route path="/user/notification" element={<Notification />} />
              <Route
                path="/user/volunteer/:orgId"
                element={<VolunteerManagement />}
              />
              {/* User org plugin routes */}
              {userOrgPluginRoutes.map((route) => (
                <Route
                  key={`${route.pluginId}-${route.path}`}
                  path={route.path}
                  element={
                    <PluginRouteRenderer
                      route={route}
                      fallback={<div>{t('loadingUserPlugin')}</div>}
                    />
                  }
                />
              ))}
              <Route element={<EventDashboardScreen />}>
                <Route
                  path="/user/event/:orgId/:eventId"
                  element={<EventManagement />}
                />
              </Route>
            </Route>
          </Route>
          {/* <SecuredRouteForUser path="/user/chat" component={Chat} /> */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}

export default App;
