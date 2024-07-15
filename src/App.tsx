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
import OrganizationAgendaCategory from 'screens/OrganizationAgendaCategory/OrganizationAgendaCategory';
import OrganizationDashboard from 'screens/OrganizationDashboard/OrganizationDashboard';
import OrganizationEvents from 'screens/OrganizationEvents/OrganizationEvents';
import OrganizaitionFundCampiagn from 'screens/OrganizationFundCampaign/OrganizationFundCampagins';
import OrganizationFunds from 'screens/OrganizationFunds/OrganizationFunds';
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import Requests from 'screens/Requests/Requests';
import Users from 'screens/Users/Users';
import CommunityProfile from 'screens/CommunityProfile/CommunityProfile';
import OrganizationVenues from 'screens/OrganizationVenues/OrganizationVenues';

import React, { useEffect } from 'react';
// User Portal Components
import Donate from 'screens/UserPortal/Donate/Donate';
import Events from 'screens/UserPortal/Events/Events';
import Posts from 'screens/UserPortal/Posts/Posts';
import Organizations from 'screens/UserPortal/Organizations/Organizations';
import People from 'screens/UserPortal/People/People';
import Settings from 'screens/UserPortal/Settings/Settings';
// import UserLoginPage from 'screens/UserPortal/UserLoginPage/UserLoginPage';
import Chat from 'screens/UserPortal/Chat/Chat';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
import Advertisements from 'components/Advertisements/Advertisements';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';
import FundCampaignPledge from 'screens/FundCampaignPledge/FundCampaignPledge';

import useLocalStorage from 'utils/useLocalstorage';
import UserScreen from 'screens/UserPortal/UserScreen/UserScreen';
import EventDashboardScreen from 'components/EventDashboardScreen/EventDashboardScreen';

const { setItem } = useLocalStorage();

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
    if (data) {
      setItem('name', `${data.checkAuth.firstName} ${data.checkAuth.lastName}`);
      setItem('id', data.checkAuth._id);
      setItem('email', data.checkAuth.email);
      setItem('IsLoggedIn', 'TRUE');
      setItem('FirstName', data.checkAuth.firstName);
      setItem('LastName', data.checkAuth.lastName);
      setItem('UserImage', data.checkAuth.image);
      setItem('Email', data.checkAuth.email);
    }
  }, [data, loading]);

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
      const extraComponent = plugin[1];
      return (
        <Route
          key={index}
          path={`/plugin/${plugin[0].toLowerCase()}`}
          element={extraComponent}
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
            <Route
              path="/orgagendacategory/:orgId"
              element={<OrganizationAgendaCategory />}
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
            {extraRoutes}
          </Route>
        </Route>
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        {/* User Portal Routes */}
        <Route element={<SecuredRouteForUser />}>
          <Route path="/user/organizations" element={<Organizations />} />
          <Route path="/user/settings" element={<Settings />} />
          <Route path="/user/chat" element={<Chat />} />
          <Route element={<UserScreen />}>
            <Route path="/user/organizations" element={<Organizations />} />
            <Route path="/user/organization/:orgId" element={<Posts />} />
            <Route path="/user/people/:orgId" element={<People />} />
            <Route path="/user/donate/:orgId" element={<Donate />} />
            <Route path="/user/events/:orgId" element={<Events />} />
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
