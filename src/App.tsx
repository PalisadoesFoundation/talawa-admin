import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';

// import './App.css';
import styles from './App.module.css';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
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
import * as installedPlugins from 'components/plugins/index';
import ForgotPassword from 'screens/ForgotPassword/ForgotPassword';
import Roles from 'screens/Roles/Roles';
import Requests from 'screens/Requests/Requests';
import BlockUser from 'screens/BlockUser/BlockUser';
import MemberDetail from 'screens/MemberDetail/MemberDetail';

function App(): JSX.Element {
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

  const extraRoutes = Object.entries(installedPlugins).map(
    (plugin: any, index) => {
      const ExtraComponent = plugin[1];
      return (
        <SecuredRoute
          key={index}
          path={`/plugin/${plugin[0].toLowerCase()}`}
          component={ExtraComponent}
        />
      );
    }
  );

  if (loading) {
    return <div className={styles.loader}></div>;
  }

  if (data) {
    localStorage.setItem(
      'name',
      `${data.checkAuth.firstName} ${data.checkAuth.lastName}`
    );
    localStorage.setItem('id', data.checkAuth._id);
    localStorage.setItem('email', data.checkAuth.email);
    localStorage.setItem('IsLoggedIn', 'TRUE');
    localStorage.setItem('UserType', data.checkAuth.userType);
  } else {
    localStorage.clear();
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
        <SecuredRoute path="/roles" component={Roles} />
        <SecuredRoute path="/requests" component={Requests} />
        <SecuredRoute path="/blockuser" component={BlockUser} />
        {extraRoutes}
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="*" component={PageNotFound} />
      </Switch>
    </>
  );
}

export default App;
