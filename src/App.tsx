import React from 'react';
import { Route, Routes } from 'react-router-dom';
import * as installedPlugins from 'components/plugins/index';
import SecuredRoute from 'components/SecuredRoute/SecuredRoute';
import LoginPage from 'screens/LoginPage/LoginPage';
import OrganizationEvents from 'screens/OrganizationEvents/OrganizationEvents';
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import OrganizationDashboard from 'screens/OrganizationDashboard/OrganizationDashboard';
import OrgContribution from 'screens/OrgContribution/OrgContribution';
import OrgList from 'screens/OrgList/OrgList';
import OrgPost from 'screens/OrgPost/OrgPost';
import OrgSettings from 'screens/OrgSettings/OrgSettings';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import AddOnStore from 'components/AddOn/core/AddOnStore/AddOnStore';
import ForgotPassword from 'screens/ForgotPassword/ForgotPassword';
import Users from 'screens/Users/Users';
import BlockUser from 'screens/BlockUser/BlockUser';
import EventDashboard from 'screens/EventDashboard/EventDashboard';
import MemberDetail from 'screens/MemberDetail/MemberDetail';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';

// User Portal Components
import UserLoginPage from 'screens/UserPortal/UserLoginPage/UserLoginPage';
import Organizations from 'screens/UserPortal/Organizations/Organizations';
import Home from 'screens/UserPortal/Home/Home';
import People from 'screens/UserPortal/People/People';
import Settings from 'screens/UserPortal/Settings/Settings';
import Donate from 'screens/UserPortal/Donate/Donate';
import Events from 'screens/UserPortal/Events/Events';
//import Chat from 'screens/UserPortal/Chat/Chat';
import Advertisements from 'components/Advertisements/Advertisements';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';

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
    }
  );

  return (
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
          <Route path="/orgcontribution" element={<OrgContribution />} />
          <Route path="/orgpost/:orgId" element={<OrgPost />} />
          <Route path="/orgsetting/:orgId" element={<OrgSettings />} />
          <Route path="/orgstore/:orgId" element={<AddOnStore />} />
          <Route path="/orgads/:orgId" element={<Advertisements />} />
          <Route path="/blockuser/:orgId" element={<BlockUser />} />
          {extraRoutes}
        </Route>
      </Route>
      <Route path="/event/:eventId" element={<EventDashboard />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />

      {/* User Portal Routes */}
      <Route path="/user" element={<UserLoginPage />} />
      <Route element={<SecuredRouteForUser />}>
        <Route path="/user/organizations" element={<Organizations />} />
        <Route path="/user/organization/*" element={<Home />} />
        <Route path="/user/people" element={<People />} />
        <Route path="/user/settings" element={<Settings />} />
        <Route path="/user/donate" element={<Donate />} />
        <Route path="/user/events" element={<Events />} />
      </Route>
      {/* <SecuredRouteForUser path="/user/chat" component={Chat} /> */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default app;
