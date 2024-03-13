import AddOnStore from 'components/AddOn/core/AddOnStore/AddOnStore';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import SecuredRoute from 'components/SecuredRoute/SecuredRoute';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import * as installedPlugins from 'components/plugins/index';
import { Route, Routes } from 'react-router-dom';
import BlockUser from 'screens/BlockUser/BlockUser';
import EventDashboard from 'screens/EventDashboard/EventDashboard';
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
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import Users from 'screens/Users/Users';
import OrganizationVenues from 'screens/OrganizationVenues/OrganizationVenues';

// User Portal Components
import Donate from 'screens/UserPortal/Donate/Donate';
import Events from 'screens/UserPortal/Events/Events';
import Home from 'screens/UserPortal/Home/Home';
import Organizations from 'screens/UserPortal/Organizations/Organizations';
import People from 'screens/UserPortal/People/People';
import Settings from 'screens/UserPortal/Settings/Settings';
// import UserLoginPage from 'screens/UserPortal/UserLoginPage/UserLoginPage';
// import Chat from 'screens/UserPortal/Chat/Chat';
import Advertisements from 'components/Advertisements/Advertisements';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';
import React from 'react';

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

  const extraRoutes = Object.entries(installedPlugins).map(
    (plugin: any, index) => {
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
          </Route>
          <Route element={<OrganizationScreen />}>
            <Route path="/orgdash/:orgId" element={<OrganizationDashboard />} />
            <Route path="/orgpeople/:orgId" element={<OrganizationPeople />} />
            <Route path="/member/:orgId" element={<MemberDetail />} />
            <Route path="/orgevents/:orgId" element={<OrganizationEvents />} />
            <Route
              path="/orgactionitems/:orgId"
              element={<OrganizationActionItems />}
            />
            <Route path="/orgfunds/:orgId" element={<OrganizationFunds />} />
            <Route
              path="/orgfundcampaign/:orgId/:fundId"
              element={<OrganizaitionFundCampiagn />}
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
        <Route path="/event/:eventId" element={<EventDashboard />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        {/* User Portal Routes */}
        <Route element={<SecuredRouteForUser />}>
          <Route path="/user/organizations" element={<Organizations />} />
          <Route path="/user/organization/:orgId" element={<Home />} />
          <Route path="/user/people/:orgId" element={<People />} />
          <Route path="/user/settings" element={<Settings />} />
          <Route path="/user/donate/:orgId" element={<Donate />} />
          <Route path="/user/events/:orgId" element={<Events />} />
        </Route>
        {/* <SecuredRouteForUser path="/user/chat" component={Chat} /> */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default app;
