import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import WelcomePage from 'screens/WelcomePage/WelcomePage';
import LoginPage from 'screens/LoginPage/LoginPage';
import MainUserPage from 'screens/MainUserPage/MainUserPage';
import OrgAdminHomePage from 'screens/OrgAdminHomePage/OrgAdminHomePage';
import OrgAdminMemberPage from 'screens/OrgAdminMemberPage/OrgAdminMemberPage';
import SuperAdminMemberPage from 'screens/SuperAdminMemberPage/SuperAdminMemberPage';
import SuperAdminOrgPage from 'screens/SuperAdminOrgPage/SuperAdminOrgPage';
import SuperAdminDashboard from 'screens/SuperAdminDashboard/SuperAdminDashboard';
import SuperAdminOrgMemberPage from 'screens/SuperAdminOrgMember/SuperAdminOrgMember';
import SuperAdminUserOrgPage from 'screens/SuperAdminUserOrg/SuperAdminUserOrg';
import SuperAdminOrgHomePage from 'screens/SuperAdminOrgHomePage/SuperAdminOrgHomePage';
import OrgCreationPage from 'screens/OrgCreationPage/OrgCreationPage';
import SelectOrganizationPage from 'screens/SelectOrganization/SelectOrganization';
function App(): JSX.Element {
  const isLoggedInAs = localStorage.getItem('isloggedinas');

  return (
    <>
      <Switch>
        <Route exact path="/" component={WelcomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route path="/orghome">
          {isLoggedInAs != 'ORGADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <OrgAdminHomePage />
          )}
        </Route>
        <Route path="/orgmember">
          {isLoggedInAs != 'ORGADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <OrgAdminMemberPage />
          )}
        </Route>
        <Route path="/selectorg">
          {isLoggedInAs != 'ORGADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <SelectOrganizationPage />
          )}
        </Route>
        <Route exact path="/supermember">
          {isLoggedInAs != 'SUPERADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <SuperAdminMemberPage />
          )}
        </Route>
        <Route exact path="/superorg">
          {isLoggedInAs != 'SUPERADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <SuperAdminOrgPage />
          )}
        </Route>
        <Route exact path="/superdash">
          {isLoggedInAs != 'SUPERADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <SuperAdminDashboard />
          )}
        </Route>
        <Route path="/superorgmember">
          {isLoggedInAs != 'SUPERADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <SuperAdminOrgMemberPage />
          )}
        </Route>
        <Route exact path="/superuserorg">
          {isLoggedInAs != 'SUPERADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <SuperAdminUserOrgPage />
          )}
        </Route>
        <Route path="/superorghome">
          {isLoggedInAs != 'SUPERADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <SuperAdminOrgHomePage />
          )}
        </Route>
        <Route path="/createorg">
          {isLoggedInAs != 'SUPERADMIN' ? (
            <Redirect to="/login" />
          ) : (
            <OrgCreationPage />
          )}
        </Route>
      </Switch>
    </>
  );
}

export default App;
