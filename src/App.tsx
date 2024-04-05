<<<<<<< HEAD
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
=======
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import * as installedPlugins from 'components/plugins/index';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
import SecuredRoute from 'components/SecuredRoute/SecuredRoute';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';
import LoginPage from 'screens/LoginPage/LoginPage';
import OrganizationEvents from 'screens/OrganizationEvents/OrganizationEvents';
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import OrganizationDashboard from 'screens/OrganizationDashboard/OrganizationDashboard';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import OrgContribution from 'screens/OrgContribution/OrgContribution';
import OrgList from 'screens/OrgList/OrgList';
import OrgPost from 'screens/OrgPost/OrgPost';
import OrgSettings from 'screens/OrgSettings/OrgSettings';
<<<<<<< HEAD
import OrganizationActionItems from 'screens/OrganizationActionItems/OrganizationActionItems';
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
import Home from 'screens/UserPortal/Home/Home';
import Organizations from 'screens/UserPortal/Organizations/Organizations';
import People from 'screens/UserPortal/People/People';
import Settings from 'screens/UserPortal/Settings/Settings';
// import UserLoginPage from 'screens/UserPortal/UserLoginPage/UserLoginPage';
// import Chat from 'screens/UserPortal/Chat/Chat';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
import Advertisements from 'components/Advertisements/Advertisements';
import SecuredRouteForUser from 'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser';
import FundCampaignPledge from 'screens/FundCampaignPledge/FundCampaignPledge';

import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();
=======
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import AddOnStore from 'components/AddOn/core/AddOnStore/AddOnStore';
import ForgotPassword from 'screens/ForgotPassword/ForgotPassword';
import Users from 'screens/Users/Users';
import Requests from 'screens/Requests/Requests';
import BlockUser from 'screens/BlockUser/BlockUser';
import EventDashboard from 'screens/EventDashboard/EventDashboard';
import MemberDetail from 'screens/MemberDetail/MemberDetail';
import Loader from 'components/Loader/Loader';

// User Portal Components
import UserLoginPage from 'screens/UserPortal/UserLoginPage/UserLoginPage';
import Organizations from 'screens/UserPortal/Organizations/Organizations';
import Home from 'screens/UserPortal/Home/Home';
import People from 'screens/UserPortal/People/People';
import Settings from 'screens/UserPortal/Settings/Settings';
import Donate from 'screens/UserPortal/Donate/Donate';
import Events from 'screens/UserPortal/Events/Events';
import Tasks from 'screens/UserPortal/Tasks/Tasks';
// import Chat from 'screens/UserPortal/Chat/Chat';
import Advertisements from 'components/Advertisements/Advertisements';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

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
<<<<<<< HEAD
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
            <Route path="/requests" element={<Requests />} />
            <Route path="/users" element={<Users />} />
            <Route path="/communityProfile" element={<CommunityProfile />} />
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
=======
      localStorage.setItem(
        'name',
        `${data.checkAuth.firstName} ${data.checkAuth.lastName}`
      );
      localStorage.setItem('id', data.checkAuth._id);
      localStorage.setItem('email', data.checkAuth.email);
      localStorage.setItem('IsLoggedIn', 'TRUE');
      localStorage.setItem('UserType', data.checkAuth.userType);
      localStorage.setItem('FirstName', data.checkAuth.firstName);
      localStorage.setItem('LastName', data.checkAuth.lastName);
      localStorage.setItem('UserImage', data.checkAuth.image);
      localStorage.setItem('Email', data.checkAuth.email);
    }
  }, [data, loading]);

  const extraRoutes = Object.entries(installedPlugins).map(
    (plugin: any, index) => {
      const extraComponent = plugin[1];
      return (
        <SecuredRoute
          key={index}
          path={`/plugin/${plugin[0].toLowerCase()}`}
          component={extraComponent}
        />
      );
    }
  );

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <SecuredRoute path="/orgdash" component={OrganizationDashboard} />
        <SecuredRoute path="/orgpeople" component={OrganizationPeople} />
        <SecuredRoute path="/orglist" component={OrgList} />
        <SecuredRoute path="/member" component={MemberDetail} />
        <SecuredRoute path="/orgevents" component={OrganizationEvents} />
        <SecuredRoute path="/orgcontribution" component={OrgContribution} />
        <SecuredRoute path="/orgpost" component={OrgPost} />
        <SecuredRoute path="/orgsetting" component={OrgSettings} />
        <SecuredRoute path="/orgstore" component={AddOnStore} />
        <SecuredRoute path="/orgads" component={Advertisements} />
        <SecuredRoute path="/users" component={Users} />
        <SecuredRoute path="/requests" component={Requests} />
        <SecuredRoute path="/blockuser" component={BlockUser} />
        <SecuredRoute path="/event/:eventId" component={EventDashboard} />
        {extraRoutes}
        <Route exact path="/forgotPassword" component={ForgotPassword} />

        {/* User Portal Routes */}
        <Route exact path="/user" component={UserLoginPage} />
        <SecuredRouteForUser
          path="/user/organizations"
          component={Organizations}
        />
        <SecuredRouteForUser path="/user/organization" component={Home} />
        <SecuredRouteForUser path="/user/people" component={People} />
        <SecuredRouteForUser path="/user/settings" component={Settings} />
        <SecuredRouteForUser path="/user/donate" component={Donate} />
        <SecuredRouteForUser path="/user/events" component={Events} />
        <SecuredRouteForUser path="/user/tasks" component={Tasks} />
        {/* <SecuredRouteForUser path="/user/chat" component={Chat} /> */}

        <Route exact path="*" component={PageNotFound} />
      </Switch>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    </>
  );
}

export default app;
