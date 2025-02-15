import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';
import SecuredRoute from 'components/SecuredRoute/SecuredRoute';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';
import * as installedPlugins from 'components/plugins/index';
import OrganizaitionFundCampiagn from 'screens/OrganizationFundCampaign/OrganizationFundCampagins';
import LoginPage from 'screens/LoginPage/LoginPage';

const AddOnStore = lazy(
  () => import('components/AddOn/core/AddOnStore/AddOnStore'),
);
const OrganizationScreen = lazy(
  () => import('components/OrganizationScreen/OrganizationScreen'),
);
const SuperAdminScreen = lazy(
  () => import('components/SuperAdminScreen/SuperAdminScreen'),
);
const BlockUser = lazy(() => import('screens/BlockUser/BlockUser'));
const EventManagement = lazy(
  () => import('screens/EventManagement/EventManagement'),
);
const ForgotPassword = lazy(
  () => import('screens/ForgotPassword/ForgotPassword'),
);
const MemberDetail = lazy(() => import('screens/MemberDetail/MemberDetail'));
const OrgContribution = lazy(
  () => import('screens/OrgContribution/OrgContribution'),
);
const OrgList = lazy(() => import('screens/OrgList/OrgList'));
const OrgPost = lazy(() => import('screens/OrgPost/OrgPost'));
const OrgSettings = lazy(() => import('screens/OrgSettings/OrgSettings'));
const OrganizationActionItems = lazy(
  () => import('screens/OrganizationActionItems/OrganizationActionItems'),
);
const OrganizationDashboard = lazy(
  () => import('screens/OrganizationDashboard/OrganizationDashboard'),
);
const OrganizationEvents = lazy(
  () => import('screens/OrganizationEvents/OrganizationEvents'),
);
const OrganizationFunds = lazy(
  () => import('screens/OrganizationFunds/OrganizationFunds'),
);
const FundCampaignPledge = lazy(
  () => import('screens/FundCampaignPledge/FundCampaignPledge'),
);
const OrganizationPeople = lazy(
  () => import('screens/OrganizationPeople/OrganizationPeople'),
);
const OrganizationTags = lazy(
  () => import('screens/OrganizationTags/OrganizationTags'),
);
const ManageTag = lazy(() => import('screens/ManageTag/ManageTag'));
const SubTags = lazy(() => import('screens/SubTags/SubTags'));
const PageNotFound = lazy(() => import('screens/PageNotFound/PageNotFound'));
const Requests = lazy(() => import('screens/Requests/Requests'));
const Users = lazy(() => import('screens/Users/Users'));
const CommunityProfile = lazy(
  () => import('screens/CommunityProfile/CommunityProfile'),
);
const OrganizationVenues = lazy(
  () => import('screens/OrganizationVenues/OrganizationVenues'),
);
const Leaderboard = lazy(() => import('screens/Leaderboard/Leaderboard'));
const Advertisements = lazy(
  () => import('components/Advertisements/Advertisements'),
);
const Donate = lazy(() => import('screens/UserPortal/Donate/Donate'));
const Events = lazy(() => import('screens/UserPortal/Events/Events'));
const Posts = lazy(() => import('screens/UserPortal/Posts/Posts'));
const Organizations = lazy(
  () => import('screens/UserPortal/Organizations/Organizations'),
);
const People = lazy(() => import('screens/UserPortal/People/People'));
const Settings = lazy(() => import('screens/UserPortal/Settings/Settings'));
const Chat = lazy(() => import('screens/UserPortal/Chat/Chat'));
const UserScreen = lazy(
  () => import('screens/UserPortal/UserScreen/UserScreen'),
);
const EventDashboardScreen = lazy(
  () => import('components/EventDashboardScreen/EventDashboardScreen'),
);
const Campaigns = lazy(() => import('screens/UserPortal/Campaigns/Campaigns'));
const Pledges = lazy(() => import('screens/UserPortal/Pledges/Pledges'));
const VolunteerManagement = lazy(
  () => import('screens/UserPortal/Volunteer/VolunteerManagement'),
);
const LeaveOrganization = lazy(
  () => import('screens/UserPortal/LeaveOrganization/LeaveOrganization'),
);

const { setItem } = useLocalStorage();

/**
 * This is the main function for our application. It sets up all the routes and components,
 * defining how the user can navigate through the app. The function uses React Router's `Routes`
 * and `Route` components to map different URL paths to corresponding screens and components.
 *
 * ## Important Details
 * - **UseEffect Hook**: This hook checks user authentication status using the `CHECK_AUTH` GraphQL query.
 * - **Plugins**: It dynamically loads additional routes for any installed plugins.
 * - **Routes**:
 *   - The root route ("/") takes the user to the `LoginPage`.
 *   - Protected routes are wrapped with the `SecuredRoute` component to ensure they are only accessible to authenticated users.
 *   - Admin and Super Admin routes allow access to organization and user management screens.
 *   - User portal routes allow end-users to interact with organizations, settings, chat, events, etc.
 *
 * @returns  The rendered routes and components of the application.
 */

function app(): JSX.Element {
  /*const { updatePluginLinks, updateInstalled } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const getInstalledPlugins = async () => {
    const plugins = await fetchInstalled();
    updateInstalled(plugins);
    updatePluginLinks(new PluginHelper().generateLinks(plugins));
  };

  const fetchInstalled = async () => {
    const result = await fetch(`http://localhost:3005/installed`);
    return await result.json();
  };

  useEffect(() => {
    getInstalledPlugins();
  }, []);*/

  // const appRoutes = useSelector((state: RootState) => state.appRoutes);
  // const { components } = appRoutes;

  // TODO: Fetch Installed plugin extras and store for use within MainContent and Side Panel Components.

  const { data, loading } = useQuery(CHECK_AUTH);

  useEffect(() => {
    if (!loading && data?.checkAuth) {
      const auth = data.checkAuth;
      setItem('IsLoggedIn', 'TRUE');
      setItem('name', `${auth.firstName} ${auth.lastName}`);
      setItem('FirstName', auth.firstName);
      setItem('LastName', auth.lastName);
      setItem('email', auth.email);
      setItem('UserImage', auth.image);
    }
  }, [data, loading, setItem]);

  const extraRoutes = Object.entries(installedPlugins).map(
    (
      plugin: [
        string,
        (
          | typeof installedPlugins.DummyPlugin
          | typeof installedPlugins.DummyPlugin2
        ),
      ],
      index: number,
    ) => {
      const ExtraComponent = plugin[1];
      return (
        <Route
          key={index}
          path={`/plugin/${plugin[0].toLowerCase()}`}
          element={<ExtraComponent />}
        />
      );
    },
  );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<SecuredRoute />}>
            <Route element={<SuperAdminScreen />}>
              <Route path="/orglist" element={<OrgList />} />
              <Route path="/member" element={<MemberDetail />} />
              <Route path="/users" element={<Users />} />
              <Route path="/communityProfile" element={<CommunityProfile />} />
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
              <Route path="/member/:orgId" element={<MemberDetail />} />
              <Route
                path="/orgevents/:orgId"
                element={<OrganizationEvents />}
              />
              <Route
                path="/event/:orgId/:eventId"
                element={<EventManagement />}
              />
              <Route
                path="/orgactionitems/:orgId"
                element={<OrganizationActionItems />}
              />
              <Route path="/orgfunds/:orgId" element={<OrganizationFunds />} />
              <Route
                path="/orgfundcampaign/:orgId/:fundId"
                element={<OrganizaitionFundCampiagn />}
              />
              <Route
                path="/fundCampaignPledge/:orgId/:fundCampaignId"
                element={<FundCampaignPledge />}
              />
              <Route path="/orgcontribution" element={<OrgContribution />} />
              <Route path="/orgpost/:orgId" element={<OrgPost />} />
              <Route path="/orgsetting/:orgId" element={<OrgSettings />} />
              <Route path="/orgstore/:orgId" element={<AddOnStore />} />
              <Route path="/orgads/:orgId" element={<Advertisements />} />
              <Route path="/blockuser/:orgId" element={<BlockUser />} />
              <Route
                path="/orgvenues/:orgId"
                element={<OrganizationVenues />}
              />
              <Route path="/leaderboard/:orgId" element={<Leaderboard />} />
              {extraRoutes}
            </Route>
          </Route>
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          {/* User Portal Routes */}
          <Route element={<SecuredRouteForUser />}>
            <Route path="/user/organizations" element={<Organizations />} />
            <Route path="/user/settings" element={<Settings />} />
            <Route element={<UserScreen />}>
              <Route path="/user/chat/:orgId" element={<Chat />} />
              <Route path="/user/organizations" element={<Organizations />} />
              <Route path="/user/organization/:orgId" element={<Posts />} />
              <Route path="/user/people/:orgId" element={<People />} />
              <Route path="/user/donate/:orgId" element={<Donate />} />
              <Route path="/user/events/:orgId" element={<Events />} />
              <Route path="/user/campaigns/:orgId" element={<Campaigns />} />
              <Route path="/user/pledges/:orgId" element={<Pledges />} />
              <Route
                path="/user/leaveOrg/:orgId"
                element={<LeaveOrganization />}
              />
              <Route
                path="/user/volunteer/:orgId"
                element={<VolunteerManagement />}
              />
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
    </>
  );
}

export default app;
