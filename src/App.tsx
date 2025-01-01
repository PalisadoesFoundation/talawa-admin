import AddOnStore from 'components/AddOn/core/AddOnStore/AddOnStore';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import SecuredRoute from 'components/SecuredRoute/SecuredRoute';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import * as installedPlugins from 'components/plugins/index';
import { Route, Routes } from 'react-router-dom';
import BlockUser from 'screens/BlockUser/BlockUser';
import EventManagement from 'screens/EventManagement/EventManagement';
import ForgotPassword from 'screens/ForgotPassword/ForgotPassword';
import LoginPage from 'screens/LoginPage/LoginPage';
import MemberDetail from 'screens/MemberDetail/MemberDetail';
import OrgContribution from 'screens/OrgContribution/OrgContribution';
import OrgList from 'screens/OrgList/OrgList';
import OrgPost from 'screens/OrgPost/OrgPost';
import OrgSettings from 'screens/OrgSettings/OrgSettings';
import OrganizationActionItems from 'screens/OrganizationActionItems/OrganizationActionItems';
import OrganizationDashboard from 'screens/OrganizationDashboard/OrganizationDashboard';
import OrganizationEvents from 'screens/OrganizationEvents/OrganizationEvents';
import OrganizaitionFundCampiagn from 'screens/OrganizationFundCampaign/OrganizationFundCampagins';
import OrganizationFunds from 'screens/OrganizationFunds/OrganizationFunds';
import FundCampaignPledge from 'screens/FundCampaignPledge/FundCampaignPledge';
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import OrganizationTags from 'screens/OrganizationTags/OrganizationTags';
import ManageTag from 'screens/ManageTag/ManageTag';
import SubTags from 'screens/SubTags/SubTags';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import Requests from 'screens/Requests/Requests';
import Users from 'screens/Users/Users';
import CommunityProfile from 'screens/CommunityProfile/CommunityProfile';
import OrganizationVenues from 'screens/OrganizationVenues/OrganizationVenues';
import Leaderboard from 'screens/Leaderboard/Leaderboard';

import React, { useEffect } from 'react';
// User Portal Components
import Donate from 'screens/UserPortal/Donate/Donate';
import Events from 'screens/UserPortal/Events/Events';
import Posts from 'screens/UserPortal/Posts/Posts';
import Organizations from 'screens/UserPortal/Organizations/Organizations';
import People from 'screens/UserPortal/People/People';
import Settings from 'screens/UserPortal/Settings/Settings';
// import Chat from 'screens/UserPortal/Chat/Chat';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
import Advertisements from 'components/Advertisements/Advertisements';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';

import useLocalStorage from 'utils/useLocalstorage';
import UserScreen from 'screens/UserPortal/UserScreen/UserScreen';
import EventDashboardScreen from 'components/EventDashboardScreen/EventDashboardScreen';
import Campaigns from 'screens/UserPortal/Campaigns/Campaigns';
import Pledges from 'screens/UserPortal/Pledges/Pledges';
import VolunteerManagement from 'screens/UserPortal/Volunteer/VolunteerManagement';
import LeaveOrganization from 'screens/UserPortal/LeaveOrganization/LeaveOrganization';

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
      setItem('id', auth._id);
      setItem('name', `${auth.firstName} ${auth.lastName}`);
      setItem('FirstName', auth.firstName);
      setItem('LastName', auth.lastName);
      setItem('email', auth.email);
      setItem('Email', auth.email);
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
            <Route path="/orgdash/:orgId" element={<OrganizationDashboard />} />
            <Route path="/orgpeople/:orgId" element={<OrganizationPeople />} />
            <Route path="/orgtags/:orgId" element={<OrganizationTags />} />
            <Route
              path="orgtags/:orgId/manageTag/:tagId"
              element={<ManageTag />}
            />
            <Route path="orgtags/:orgId/subTags/:tagId" element={<SubTags />} />
            <Route path="/member/:orgId" element={<MemberDetail />} />
            <Route path="/orgevents/:orgId" element={<OrganizationEvents />} />
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
            <Route path="/orgvenues/:orgId" element={<OrganizationVenues />} />
            <Route path="/leaderboard/:orgId" element={<Leaderboard />} />
            {extraRoutes}
          </Route>
        </Route>
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        {/* User Portal Routes */}
        <Route element={<SecuredRouteForUser />}>
          <Route path="/user/organizations" element={<Organizations />} />
          <Route path="/user/settings" element={<Settings />} />
          {/* <Route path="/user/chat" element={<Chat />} /> */}
          <Route element={<UserScreen />}>
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
    </>
  );
}

export default app;
