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
          <div>
            <Route path="/orgdash" component={OrganizationDashboard} />
            <Route path="/orgpeople" component={OrganizationPeople} />
          </div>
        ) : null}
      </Switch>
    </>
  );
}

export default App;
