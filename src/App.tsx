import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomePage from 'screens/WelcomePage/WelcomePage';
import LoginPage from 'screens/LoginPage/LoginPage';
import OrgAdminHomePage from 'screens/OrgAdminHomePage/OrgAdminHomePage';
import OrgAdminMemberPage from 'screens/OrgAdminMemberPage/OrgAdminMemberPage';
import SuperAdminMemberPage from 'screens/SuperAdminMemberPage/SuperAdminMemberPage';
import SuperAdminOrgPage from 'screens/SuperAdminOrgPage/SuperAdminOrgPage';
import SuperAdminDashboard from 'screens/SuperAdminDashboard/SuperAdminDashboard';
import SuperAdminOrgMemberPage from 'screens/SuperAdminOrgMember/SuperAdminOrgMember';
import SuperAdminUserOrgPage from 'screens/SuperAdminUserOrg/SuperAdminUserOrg';
function App(): JSX.Element {
  return (
    <>
      <Switch>
        <Route exact path="/" component={WelcomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/orghome" component={OrgAdminHomePage} />
        <Route exact path="/orgmember" component={OrgAdminMemberPage} />
        <Route exact path="/supermember" component={SuperAdminMemberPage} />
        <Route exact path="/superorg" component={SuperAdminOrgPage} />
        <Route exact path="/superdash" component={SuperAdminDashboard} />
        <Route
          exact
          path="/superorgmember"
          component={SuperAdminOrgMemberPage}
        />
        <Route exact path="/superuserorg" component={SuperAdminUserOrgPage} />
      </Switch>
    </>
  );
}

export default App;
