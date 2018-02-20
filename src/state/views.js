import React from 'react';
import {Route} from 'mobx-router';
import {toJS} from 'mobx';

import config from '../config';

/* VIEWS */
import Home from '../components/home';
import Landing from '../components/landing';
import Error404 from '../components/error/error-404';
import LoginPage from '../components/account/login-page';
import RegisterPage from '../components/account/register-page';
import RegisterFormPage from '../components/account/register-form-page';
import RecoverPasswordPage from '../components/account/recover-password-page';
import RecoverPasswordConfirmPage from '../components/account/recover-password-confirm-page';
import ActivationPage from '../components/account/activation-page';
import AccountSettings from '../components/account/settings';

const Views = {

  /* HOME */
  home : new Route({
    name : 'home',
    path : '/',
    component : <Home />,
    onEnter : (route, params, store) => {
      !store.user.isSignedIn && store.router.goTo(Views.welcome, {}, store);
    }
  }),

  /* LANDING / WELCOME */
  welcome : new Route({
    name : 'welcome',
    path : '/welcome',
    component : <Landing />,
    onEnter: (route, params, store) => {
      store.user.isSignedIn && store.router.goTo(Views.home, {}, store);
    }
  }),

  /* ACCOUNT PATHS */
  login : new Route({
    path: '/login',
    name : 'login',
    component: <LoginPage />,
    beforeEnter: (route, params, store) => store.user.setLastLoggedOutView(),
    onEnter : (route, params, store) => {
      store.user.isSignedIn && store.router.goTo(Views.home, {}, store);
    }
  }),

  register : new Route({
    name : 'register',
    path: '/register',
    component : <RegisterPage />,
    beforeEnter: (route, params, store) => store.user.setLastLoggedOutView(),
    onEnter : (route, params, store) => {
      store.user.isSignedIn && store.router.goTo(Views.home, {}, store)
    }
  }),

  registerFormPage : new Route({
    name : 'registerFormPage',
    path: '/register-form',
    component : <RegisterFormPage />,
  }),

  activate : new Route({
    path: '/activation/:outcome',
    component: <ActivationPage />,
    onEnter: (route, params, store) => store.user.isSignedIn && store.goTo('home')
  }),

  recoverPass : new Route({
    path: '/recover-password',
    component: <RecoverPasswordPage />,
    onEnter: (route, params, store) => store.user.isSignedIn && store.goTo('home')
  }),

  recoverPassCofirm : new Route({
    path: '/recover-password/confirm/:uid/:token',
    component: <RecoverPasswordConfirmPage />,
    onEnter: (route, params, store) => store.user.isSignedIn && store.goTo('home')
  }),

  settings : new Route({
    path: '/settings/:page?',
    component: <AccountSettings />,
  }),

  /* 404 */
  notFound : new Route({
    path: '*',
    component: <Error404 errorId="NOT_FOUND" />
  })
}

export default Views;
