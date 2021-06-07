import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomePage from 'screens/WelcomePage/WelcomePage';
import LoginPage from 'screens/LoginPage/LoginPage';
import OrgAdminHomePage from 'screens/OrgAdminHomePage/OrgAdminHomePage';
function App(): JSX.Element {
  return (
    <>
      <Switch>
        <Route exact path="/" component={WelcomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/orghome" component={OrgAdminHomePage} />
      </Switch>
    </>
  );
}

export default App;
