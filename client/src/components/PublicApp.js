import React from 'react';
import { Route, Redirect } from "react-router-dom";

import Login from '../containers/UserAuth/Login/Login.js';
import Register from '../containers/UserAuth/Register/Register.js';
import LandingPage from './LandingPage/LandingPage.js';

const PublicApp = () => (
  <>
    <Route path="/" exact>
      <Redirect to="/home" />
    </Route>
    <Route path="/home" exact component={LandingPage} />
    <Route path="/signin" exact component={Login} />
    <Route path="/users" exact component={Register} />
  </>
)

export default PublicApp;
