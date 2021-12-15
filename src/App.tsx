import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginPage from 'screens/LoginPage/LoginPage';
import OrganizationEvents from 'screens/OrganizationEvents/OrganizationEvents';
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import OrganizationDashboard from 'screens/OrganizationDashboard/OrganizationDashboard';
import OrgContribution from 'screens/OrgContribution/OrgContribution';
import OrgList from 'screens/OrgList/OrgList';
import OrgPost from 'screens/OrgPost/OrgPost';
import OrgSettings from 'screens/OrgSettings/OrgSettings';
import AddOnStore from 'components/AddOn/core/AddOnStore/AddOnStore';
import * as installedPlugins from 'components/plugins/index';
import { bindActionCreators } from 'redux';
import { actionCreators } from './state/index';
import PluginHelper from 'components/AddOn/support/services/Plugin.helper';

function App(): JSX.Element {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');

  const dispatch = useDispatch();

  const { updatePluginLinks, updateInstalled } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const getInstalledPlugins = async () => {
    const plugins = await fetchInstalled();
    updateInstalled(plugins);
    updatePluginLinks(new PluginHelper().generateLinks(plugins));
  };

  const fetchInstalled = async () => {
    const result = await fetch(`http://localhost:4000/installed`);
    return await result.json();
  };

  useEffect(() => {
    getInstalledPlugins();
  }, []);

  // const appRoutes = useSelector((state: RootState) => state.appRoutes);
  // const { components } = appRoutes;

  // TODO: Fetch Installed plugin extras and store for use within MainContent and Side Panel Components.

  const extraRoutes = Object.entries(installedPlugins).map(
    (plugin: any, index) => {
      const ExtraComponent = plugin[1];
      return (
        <Route
          key={index}
          path={`/plugin/${plugin[0].toLowerCase()}`}
          component={ExtraComponent}
        />
      );
    }
  );

  return (
    <>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        {isLoggedIn == 'TRUE' ? (
          <div>
            <Route path="/orgdash" component={OrganizationDashboard} />
            <Route path="/orgpeople" component={OrganizationPeople} />
            <Route path="/orglist" component={OrgList} />
            <Route path="/orgevents" component={OrganizationEvents} />
            <Route path="/orgcontribution" component={OrgContribution} />
            <Route path="/orgpost" component={OrgPost} />
            <Route path="/orgsetting" component={OrgSettings} />
            <Route path="/orgstore" component={AddOnStore} />
            {extraRoutes}
          </div>
        ) : null}
      </Switch>
    </>
  );
}

export default App;
