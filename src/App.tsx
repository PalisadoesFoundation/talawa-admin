import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomePage from './Screens/WelcomePage';
import AboutPage from './Screens/AboutPage';
import LoginPage from './Screens/LoginPage';
function App() {
  return (
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route exact path="/About" component={AboutPage} />
      <Route exact path="/Login" component={LoginPage} />
    </Switch>
  );
}

export default App;
