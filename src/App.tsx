import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LoginPage from 'screens/LoginPage/LoginPage';
import OrganizationPeople from 'screens/OrganizationPeople/OrganizationPeople';
import OrganizationDashboard from 'screens/OrganizationDashboard/OrganizationDashboard';
function App(): JSX.Element {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');
  return (
    <>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        {isLoggedIn == 'TRUE' ? (
          <Route path="/orgdash" component={OrganizationDashboard} />
        ) : null}
        {isLoggedIn == 'TRUE' ? (
          <Route path="/orgpeople" component={OrganizationPeople} />
        ) : null}
      </Switch>
    </>
  );
}

export default App;
