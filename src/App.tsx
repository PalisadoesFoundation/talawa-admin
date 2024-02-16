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
import Loader from 'components/Loader/Loader';

// User Portal Components
import UserLoginPage from 'screens/UserPortal/UserLoginPage/UserLoginPage';
import Organizations from 'screens/UserPortal/Organizations/Organizations';
import Home from 'screens/UserPortal/Home/Home';
import People from 'screens/UserPortal/People/People';
import Settings from 'screens/UserPortal/Settings/Settings';
import Donate from 'screens/UserPortal/Donate/Donate';
import Events from 'screens/UserPortal/Events/Events';
// import Chat from 'screens/UserPortal/Chat/Chat';
import Advertisements from 'components/Advertisements/Advertisements';
import useLocalStorage from 'utils/useLocalstorage';

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
      setItem('UserType', data.checkAuth.userType);
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
        {/* <SecuredRouteForUser path="/user/chat" component={Chat} /> */}

        <Route exact path="*" component={PageNotFound} />
      </Switch>
    </>
  );
}

export default app;
