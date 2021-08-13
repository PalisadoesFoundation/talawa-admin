import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from 'screens/LoginPage/LoginPage';
import OrganizationEvents from 'screens/OrganizationEvents/OrganizationEvents';
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import OrganizationDashboard from 'screens/OrganizationDashboard/OrganizationDashboard';
import OrgContribution from 'screens/OrgContribution/OrgContribution';
import OrgList from 'screens/OrgList/OrgList';

function App(): JSX.Element {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');
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
          </div>
        ) : null}
      </Switch>
    </>
  );
}

export default App;
