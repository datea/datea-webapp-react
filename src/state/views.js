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
import Profile from '../components/profile';
import CampaignView from '../components/campaign-view';
import DatearTestView from '../components/dateo-form';

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
    name : 'activate',
    path: '/activation/:outcome',
    component: <ActivationPage />,
    onEnter: (route, params, store) => store.user.isSignedIn && store.goTo('home')
  }),

  recoverPass : new Route({
    name : 'recoverPass',
    path: '/recover-password',
    component: <RecoverPasswordPage />,
    onEnter: (route, params, store) => store.user.isSignedIn && store.goTo('home')
  }),

  recoverPassConfirm : new Route({
    name: 'recoverPassConfirm',
    path: '/recover-password/confirm/:uid/:token',
    component: <RecoverPasswordConfirmPage />,
    onEnter: (route, params, store) => store.user.isSignedIn && store.goTo('home')
  }),

  settings : new Route({
    name: 'settings',
    path: '/settings/:page?',
    component: <AccountSettings />,
  }),

  datear : new Route({
    name: 'datear',
    path : '/datear/:id?',
    component: <DatearTestView />,
  }),

  profile : new Route({
    name : 'profile',
    path: '/:username',
    component: <Profile />
  }),

  profileDateos : new Route({
    name : 'profileDateos',
    path: '/:username/dateos',
    component: <Profile />
  }),

  /* CAMPAIGNS - TAGS */
  campaign : new Route({
    name : 'campaign',
    path: '/:username/:campaignSlug',
    component : <CampaignView />,
    onEnter: (route, params, store) => {
      store.campaignView.loadView(params.username, params.slug)
    }
  }),

  /* 404 */
  notFound : new Route({
    name : 'notFound',
    path: '*',
    component: <Error404 errorId="NOT_FOUND" />
  })
}

export default Views;
