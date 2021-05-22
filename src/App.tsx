import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import WelcomePage from './Screens/WelcomePage';
import About_Page from './Screens/AboutPage';
import LoginPage from './Screens/LoginPage';
function App() {
  return (
    <Switch>
      <Route exact path = "/" component = {WelcomePage}/>
      <Route exact path = "/About" component =  {About_Page}/>
      <Route exact path = "/Login" component =  {LoginPage}/>
    </Switch>
  );
}
export default App;
