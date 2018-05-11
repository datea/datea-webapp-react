import React from 'react';
import {Route} from '../mobx-router';
import {toJS} from 'mobx';
import _ from 'lodash';

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
import CampaignManagerView from '../components/campaign-manager-view';
import StaticPage from '../components/static-page';
import SearchMappingView from '../components/search-mapping-view';

const customUrls = {
  //localhost : 'admindatero'
};

const Views = {

  /* HOME */
  home : new Route({
    name : 'home',
    path : '/',
    component : <Home />,
    onEnter : (route, params, store) => {
      if (customUrls[location.hostname]) {
        store.goTo('profile', {username: customUrls[location.hostname]});
        return false;
      } else {
        if (!store.user.isSignedIn) {
          store.goTo('welcome');
        } else {
            store.ui.setLayout('normal');
            store.createHomeViewStore();
        }
      }
    },
    onExit: (route, params, store) => {
      !!store.homeView && !!store.homeView.dispose && store.homeView.dispose();
      store.homeView = null;
    },
    metaData : {
      title : {id : 'METADATA.DEFAULT.TITLE'},
      description : {id : 'METADATA.DEFAULT.DESCRIPTION'}
    }
  }),

  /* LANDING / WELCOME */
  welcome : new Route({
    name : 'welcome',
    path : '/welcome',
    component : <Landing />,
    onEnter: (route, params, store) => {
      if (customUrls[location.hostname]) {
        store.goTo('profile', {username: customUrls[location.hostname]});
        return false;
      } else {
        store.ui.setLayout('normal');
        store.user.isSignedIn && store.goTo('home');
      }
    },
    metaData : {
      title : {id : 'METADATA.DEFAULT.TITLE'},
      description : {id : 'METADATA.DEFAULT.DESCRIPTION'}
    }
  }),

  /* MAPPING SEARCH  */
  search : new Route({
    name : 'search',
    path : '/search',
    component : <SearchMappingView />,
    onEnter: (route, params, store) => {
      store.ui.setLayout('normal');
      store.createSearchMappingViewStore();
    },
    onExit: (route, params, store) => {
      !!store.searchMappingView && !!store.searchMappingView.dispose && store.searchMappingView.dispose();
      store.searchMappingView = null;
    },
    metaData : {
      title : {id : 'METADATA.SEARCH.TITLE'},
      description : {id : 'METADATA.SEARCH.DESCRIPTION'}
    }
  }),

  /* STATIC INFO */
  info : new Route({
    name : 'info',
    path : '/info/:pageId',
    component : <StaticPage />,
    onEnter: (route, params, store) => store.ui.setLayout('normal'),
    backButtonConfig : {
      view : 'home',
      showBackButton : true,
    },
    isServerSideAsync : true
  }),

  /* ACCOUNT PATHS */
  login : new Route({
    path: '/login',
    name : 'login',
    component: <LoginPage />,
    beforeEnter: (route, params, store) => store.user.setLastLoggedOutView(),
    onEnter : (route, params, store) => {
      store.ui.setLayout('normal');
      store.user.isSignedIn && store.router.goTo(Views.home, {}, store);
    },
    backButtonConfig : {
      view : 'welcome',
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.LOGIN.TITLE'},
      description : {id : 'METADATA.LOGIN.DESCRIPTION'}
    }
  }),

  register : new Route({
    name : 'register',
    path : '/register',
    component : <RegisterPage />,
    beforeEnter : (route, params, store) => store.user.setLastLoggedOutView(),
    onEnter : (route, params, store) => {
      store.ui.setLayout('normal');
      store.user.isSignedIn && store.router.goTo(Views.home, {}, store)
    },
    backButtonConfig : {
      view : 'welcome',
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.REGISTER.TITLE'},
      description : {id : 'METADATA.REGISTER.DESCRIPTION'}
    }
  }),

  registerFormPage : new Route({
    name : 'registerFormPage',
    path : '/register-form',
    component : <RegisterFormPage />,
    onEnter : (route, params, store) => {
      store.ui.setLayout('normal');
    },
    backButtonConfig : {
      view : 'register',
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.REGISTER_FORM_PAGE.TITLE'},
      description : {id : 'METADATA.REGISTER_FORM_PAGE.DESCRIPTION'}
    }
  }),

  activate : new Route({
    name : 'activate',
    path: '/activation/:outcome',
    component: <ActivationPage />,
    onEnter: (route, params, store) => {
      store.ui.setLayout('normal');
      store.user.isSignedIn && store.goTo('home')
    },
    backButtonConfig : {
      view : 'welcome',
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.ACTIVATE.TITLE'},
      description : {id : 'METADATA.ACTIVATE.DESCRIPTION'}
    }
  }),

  recoverPass : new Route({
    name : 'recoverPass',
    path: '/recover-password',
    component: <RecoverPasswordPage />,
    onEnter: (route, params, store) => {
      store.ui.setLayout('normal');
      store.user.isSignedIn && store.goTo('home')
    },
    backButtonConfig : {
      view : 'welcome',
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.RECOVER_PASS.TITLE'},
      description : {id : 'METADATA.RECOVER_PASS.DESCRIPTION'}
    }
  }),

  recoverPassConfirm : new Route({
    name: 'recoverPassConfirm',
    path: '/recover-password/confirm/:uid/:token',
    component: <RecoverPasswordConfirmPage />,
    onEnter: (route, params, store) => {
      store.ui.setLayout('normal');
      store.user.isSignedIn && store.goTo('home')
    },
    backButtonConfig : {
      view : 'welcome',
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.RECOVER_PASS_CONFIRM.TITLE'},
      description : {id : 'METADATA.RECOVER_PASS_CONFIRM.DESCRIPTION'}
    }
  }),

  settings : new Route({
    name: 'settings',
    path: '/settings/:page?',
    component: <AccountSettings />,
    onEnter: (route, params, store) => {
      store.ui.setLayout('normal');
      return !store.user.isSignedIn
    },
    backButtonConfig : {
      view : 'profile',
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.SETTINGS.TITLE'},
      description : {id : 'METADATA.SETTINGS.DESCRIPTION'}
    }
  }),

  /* CAMPAIGN EDIT */
  campaignForm : new Route({
    name : 'campaignForm',
    path : '/mapeo/:id',
    component : <CampaignManagerView />,
    onEnter: (route, params, store) => {
      store.ui.setLayout('normal');
      store.createCampaignFormStore(params.id);
    },
    backButtonConfig : (route, params, store) => {
      return {
        view : 'campaign',
        params : {
          username : store.user.data.username,
          slug : store.campaignForm.campaign.get('slug')
        },
        showBackButton :  true,
      }
    },
    metaData : {
      title : {id : 'METADATA.CAMPAIGN_FORM.TITLE'},
      description : {id : 'METADATA.CAMPAIGN_FORM.DESCRIPTION'}
    }
  }),

  profile : new Route({
    name : 'profile',
    path: '/:username',
    component: <Profile />,
    onEnter: (route, params, store) => {
      console.log('on enter profile', params.username);
      store.createProfileStore(params.username);
      store.ui.setLayout('normal');
    },
    onExit: (route, params, store) => {
      !!store.profileView && !!store.profileView.dispose && store.profileView.dispose();
      store.profileView = null;
    },
    backButtonConfig : {
      view : 'home',
      showBackButton : false,
    },
    isServerSideAsync : true
  }),

  profileDateos : new Route({
    name : 'profileDateos',
    path: '/:username/dateos',
    component: <Profile />,
    onEnter: (route, params, store) => {
      store.ui.setLayout('mapping');
    },
    backButtonConfig : (route, params, store) => ({
      view : 'profile',
      params : {
        username : store.profileView.data.user.username
      },
      showBackButton : false,
    }),
    isServerSideAsync : true
  }),

  /* CAMPAIGNS - TAGS */
  campaign : new Route({
    name : 'campaign',
    path: '/:username/:slug',
    component : <CampaignView />,
    onEnter: (route, params, store) => {
      store.ui.forceNavShadow = true;
      store.ui.setLayout('mapping');
      const campaignView = store.createCampaignViewStore();
      campaignView.loadView(params.username, params.slug)
    },
    beforeExit : (route, params, store) => { store.ui.forceNavShadow = false},
    onExit: (route, params, store) => {
      store.disposeCampaignViewStore();
    },
    shouldTriggerHooksOnSameView : ({currentParams, currentQueryParams, nextParams, nextQueryParams}) => {
      return currentParams.username != nextParams.username || currentParams.slug != nextParams.slug;
    },
    backButtonConfig : (route, params, store, queryParams) => {
      const visualIsOpen = store.campaignView.layoutMode == 'visual';
      const contentIsDetail = store.campaignView.contentViewMode == 'detail-view';

      // is root
      if (!visualIsOpen && !contentIsDetail) {
        return {
          view: 'home',
          showBackButton : false,
        }
      } else if (visualIsOpen && !contentIsDetail) {
        return {
          callback : () => store.campaignView.setLayout('content'),
          showBackButton : true,
        }
      } else if ( visualIsOpen && contentIsDetail) {
        return {
          callback : () => store.campaignView.setLayout('content'),
          showBackButton : true,
        }
      } else if (contentIsDetail) {
        let newQueryParams = _.omit(toJS(queryParams), 'dateo');
        return {
          view : 'campaign',
          params : params,
          queryParams : newQueryParams,
          showBackButton : true
        }
      }
    },
    isServerSideAsync : true,
  }),

  /* 404 */
  notFound : new Route({
    name : 'notFound',
    path: '*',
    component: <Error404 errorId="NOT_FOUND" />,
    onEnter: (route, params, store) => {
      store.ui.setLayout('normal');
    },
    metaData : {
      title : {id : 'METADATA.NOT_FOUND.TITLE'},
      description : {id : 'METADATA.NOT_FOUND.DESCRIPTION'}
    }
  })
}

export default Views;
