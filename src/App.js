import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import MainLayout from './components/main-layout';
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

import muiTheme from './theme/mui-theme.js';

import './scss/main.scss';

injectTapEventPlugin();

ReactDom.render((
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router history={browserHistory}>
      <Route path="/" component={MainLayout} >
        <IndexRoute component={Home} />
        <Route path="welcome" component={Landing}/>
        <Route path="signin" component={LoginPage} />
        <Route path="signup" component={RegisterPage} />
        <Route path="register" component={RegisterFormPage} />
        <Route path="activation/:outcome" component={ActivationPage} />
        <Route path="recover-password" component={RecoverPasswordPage} />
        <Route path="recover-password/confirm/:uid/:token" component={RecoverPasswordConfirmPage} />
        <Route path="settings(/:urlValue)" component={AccountSettings} />
        <Route path="*" errorId='NOT_FOUND' component={Error404}/>
      </Route>
    </Router>
  </MuiThemeProvider>
), document.getElementById('pageMain'));
