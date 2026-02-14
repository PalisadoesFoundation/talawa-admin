import React, { lazy, Suspense, useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router';
import { useQuery, useApolloClient } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import SecuredRoute from 'components/AdminPortal/SecuredRoute/SecuredRoute';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';
import OrganizationFundCampaign from 'screens/AdminPortal/OrganizationFundCampaign/OrganizationFundCampaigns';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import LoginPage from 'screens/Auth/LoginPage/LoginPage';
import { usePluginRoutes, PluginRouteRenderer } from 'plugin';
import { getPluginManager } from 'plugin/manager';
import { discoverAndRegisterAllPlugins } from 'plugin/registry';
import UserScreen from 'screens/UserPortal/UserScreen/UserScreen';
import UserGlobalScreen from 'screens/UserPortal/UserGlobalScreen/UserGlobalScreen';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import PageNotFound from 'screens/Public/PageNotFound/PageNotFound';
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
  () => import('screens/Auth/ForgotPassword/ForgotPassword'),
);
const MemberDetail = lazy(
  () => import('screens/AdminPortal/MemberDetail/MemberDetail'),
);
const VerifyEmail = lazy(() => import('screens/Auth/VerifyEmail/VerifyEmail'));
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
    import('screens/AdminPortal/OrganizationTransactions/OrganizationTransactions'),
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
              <Route path="/admin/orglist" element={<OrgList />} />
              <Route path="/admin/notification" element={<Notification />} />
              <Route path="/admin/profile" element={<MemberDetail />} />
              <Route path="/admin/users" element={<Users />} />
              <Route
                path="/admin/communityProfile"
                element={<CommunityProfile />}
              />
              <Route path="/admin/pluginstore" element={<PluginStore />} />
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
              <Route path="/admin/requests/:orgId" element={<Requests />} />
              <Route
                path="/admin/orgdash/:orgId"
                element={<OrganizationDashboard />}
              />
              <Route
                path="/admin/orgpeople/:orgId"
                element={<OrganizationPeople />}
              />
              <Route
                path="/admin/orgtags/:orgId"
                element={<OrganizationTags />}
              />
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
                element={<ManageTag />}
              />
              <Route
                path="/admin/orgtags/:orgId/subTags/:tagId"
                element={<SubTags />}
              />
              <Route
                path="/admin/member/:orgId/:userId"
                element={<MemberDetail />}
              />
              <Route
                path="/admin/orgevents/:orgId"
                element={<OrganizationEvents />}
              />
              <Route
                path="/admin/event/:orgId/:eventId"
                element={<EventManagement />}
              />

              <Route
                path="/admin/orgfunds/:orgId"
                element={<OrganizationFunds />}
              />
              <Route
                path="/admin/orgtransactions/:orgId"
                element={<OrganizationTransactions />}
              />
              <Route
                path="/admin/orgfundcampaign/:orgId/:fundId"
                element={<OrganizationFundCampaign />}
              />
              <Route
                path="/admin/fundCampaignPledge/:orgId/:fundCampaignId"
                element={<FundCampaignPledge />}
              />
              <Route
                path="/admin/orgcontribution"
                element={<OrgContribution />}
              />
              <Route path="/admin/orgpost/:orgId" element={<PostsPage />} />
              <Route
                path="/admin/orgsetting/:orgId"
                element={<OrgSettings />}
              />
              <Route path="/admin/orgads/:orgId" element={<Advertisements />} />
              <Route path="/admin/blockuser/:orgId" element={<BlockUser />} />
              <Route
                path="/admin/orgvenues/:orgId"
                element={<OrganizationVenues />}
              />
              <Route
                path="/admin/leaderboard/:orgId"
                element={<Leaderboard />}
              />
              <Route path="/admin/orgchat/:orgId" element={<Chat />} />
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
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          {/* Public invitation accept route */}
          <Route
            path="/event/invitation/:token"
            element={<AcceptInvitation />}
          />
          {/* User Portal Routes */}
          <Route element={<SecuredRouteForUser />}>
            <Route path="/user/organizations" element={<Organizations />} />
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
              <Route path="/user/settings" element={<MemberDetail />} />
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
