import React,{Component} from 'react';
import config from './config';
import {Route, Switch, Redirect} from 'react-router-dom';
import Home from './components/home';
import Landing from './components/landing';
import Error404 from './components/error/error-404';
import LoginPage from './components/account/login-page';
import RegisterPage from './components/account/register-page';
import RegisterFormPage from './components/account/register-form-page';
import RecoverPasswordPage from './components/account/recover-password-page';
import RecoverPasswordConfirmPage from './components/account/recover-password-confirm-page';
import ActivationPage from './components/account/activation-page';
import AccountSettings from './components/account/settings';
import USER from './stores/user';

const Routes = () =>
  <Switch>
    <Route exact path="/" render={() => USER.isSignedIn ? <Home/> : <Redirect to={'/'+config.landingPath}/>} />
    <Route path={'/'+config.landingPath} render={() => !USER.isSignedIn ? <Landing/> : <Redirect to={'/'}/> } />
    <Route path="/signin" component={LoginPage} />
    <Route path="/signup" component={RegisterPage} />
    <Route path="/register" component={RegisterFormPage} />
    <Route path="/activation/:outcome" component={ActivationPage} />
    <Route path="/recover-password" component={RecoverPasswordPage} />
    <Route path="/recover-password/confirm/:uid/:token" component={RecoverPasswordConfirmPage} />
    <Route path="/settings(/:urlValue)" component={AccountSettings} />
    <Route path="*" errorId='NOT_FOUND' component={Error404}/>
  </Switch>

export default Routes;
