import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomePage from './screens/WelcomePage/WelcomePage';
import AboutPage from './screens/AboutPage/AboutPage';
import LoginPage from './screens/LoginPage/LoginPage';
function App(): JSX.Element {
  return (
    <>
      <Switch>
        <Route exact path="/" component={WelcomePage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/login" component={LoginPage} />
      </Switch>
    </>
  );
}

export default App;
