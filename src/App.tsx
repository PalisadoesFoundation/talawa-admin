import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LoginPage from 'screens/LoginPage/LoginPage';
import OrganizationEvents from 'screens/OrganizationEvents/OrganizationEvents';
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import OrganizationDashboard from 'screens/OrganizationDashboard/OrganizationDashboard';
import OrgList from 'screens/OrgList/OrgList';

function App(): JSX.Element {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');
  return (
    <>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/orgdash" component={OrganizationDashboard} />
        <Route path="/orgpeople" component={OrganizationPeople} />
        <Route path="/orglist" component={OrgList} />
        <Route path="/orgevents" component={OrganizationEvents} />
        {isLoggedIn == 'TRUE' ? (
          <div>
            <Route path="/orgdash" component={OrganizationDashboard} />
            <Route path="/orgpeople" component={OrganizationPeople} />
            <Route path="/orglist" component={OrgList} />
            <Route path="/orgevents" component={OrganizationEvents} />
          </div>
        ) : null}
      </Switch>
    </>
  );
}

export default App;
