import React from 'react';
import {RouterState} from 'mobx-state-router';
import {toJS} from 'mobx';
import _ from 'lodash';

const customUrls = {
  //localhost : 'admindatero'
};

const callEnterHooks = (fromState, toState, rootStore) => {
  const {router} = rootStore;
  const route = router.getRoute(toState.routeName);
  route.beforeEnter && route.beforeEnter(fromState, toState, router);
  route.onEnter && route.onEnter(fromState, toState, router);
}

const accountRedirectIfLoggedIn = (fromState, toState, {rootStore}) => {
  if (!rootStore.user.isSignedIn) {
    if (['register', 'login'].includes(toState.routeName)) {
      rootStore.user.setLastLoggedOutRoute(fromState);
    }
    rootStore.ui.setLayout('normal');
    return Promise.resolve();
  } else {
    const newToState = new RouterState('home');
    callEnterHooks(fromState, newToState, rootStore);
    return Promise.reject(newToState)
  }
};

const layoutToNormal = (fromState, toState, {rootStore}) => {
  rootStore.ui.setLayout('normal');
  return Promise.resolve();
};

const isSamePath = (fromState, toState) => {
  return fromState.routeName == toState.routeName && _.isEqual(fromState.params, toState.params);
}

const Views = [

  /* HOME */
  {
    name : 'home',
    pattern : '/',
    beforeEnter : (fromState, toState, {rootStore}) => {
      let newToState;
      if (customUrls[rootStore.getHostName()]) {
        newToState = new RouterState('profile', {username: customUrls[rootStore.getHostName()]});
        callEnterHooks(fromState, newToState, rootStore);
        return Promise.reject(newToState);
      } else {
        if (!rootStore.user.isSignedIn) {
          newToState = new RouterState('welcome');
          callEnterHooks(fromState, newToState, rootStore);
          return Promise.reject(newToState);
        } else {
          rootStore.ui.setLayout('normal');
          rootStore.createHomeViewStore();
          return Promise.resolve();
        }
      }
    },
    onExit: (fromState, toState, {rootStore}) => {
      !!rootStore.homeView && !!rootStore.homeView.dispose && rootStore.homeView.dispose();
      rootStore.homeView = null;
      return Promise.resolve();
    },
    metaData : {
      title : {id : 'METADATA.DEFAULT.TITLE'},
      description : {id : 'METADATA.DEFAULT.DESCRIPTION'}
    }
  },

  /* LANDING / WELCOME */
  {
    name : 'welcome',
    pattern : '/welcome',
    beforeEnter: (fromState, toState, {rootStore}) => {
      let newToState;
      if (customUrls[rootStore.getHostName()]) {
        newToState = new RouterState('profile', {username: customUrls[rootStore.getHostName()]});
        callEnterHooks(fromState, newToState, rootStore);
        return Promise.reject(newToState);
      } else {
        if (rootStore.user.isSignedIn) {
          newToState = new RouterState('home');
          callEnterHooks(fromState, newToState, rootStore);
          return Promise.reject(newToState);
        } else {
          rootStore.ui.setLayout('normal');
          return Promise.resolve();
        }
      }
    },
    metaData : {
      title : {id : 'METADATA.DEFAULT.TITLE'},
      description : {id : 'METADATA.DEFAULT.DESCRIPTION'}
    }
  },

  /* MAPPING SEARCH  */
  {
    name : 'search',
    pattern : '/search',
    onEnter: (fromState, toState, {rootStore}) => {
      rootStore.ui.setLayout('normal');
      rootStore.createSearchMappingViewStore();
      return Promise.resolve();
    },
    onExit: (fromState, toState, {rootStore}) => {
      !!rootStore.searchMappingView && !!rootStore.searchMappingView.dispose && rootStore.searchMappingView.dispose();
      rootStore.searchMappingView = null;
      return Promise.resolve();
    },
    metaData : {
      title : {id : 'METADATA.SEARCH.TITLE'},
      description : {id : 'METADATA.SEARCH.DESCRIPTION'}
    }
  },

  /* STATIC INFO */
  {
    name : 'info',
    pattern : '/info/:pageId',
    onEnter: (fromState, toState, {rootStore}) => {
      rootStore.ui.setLayout('normal');
      return Promise.resolve();
    },
    backButtonConfig : {
      routerState : new RouterState('welcome'),
      showBackButton : true,
    },
    isServerSideAsync : true
  },

  /* ACCOUNT PATHS */
  {
    name: 'login',
    pattern: '/login',
    beforeEnter : accountRedirectIfLoggedIn,
    onEnter: (fromState, toState, {rootStore}) => {
      rootStore.createLoginStore();
      rootStore.ui.setLayout('normal');
      return Promise.resolve();
    },
    onExit : (fromState, toState, {rootStore}) => {
      rootStore.disposeLoginStore();
      return Promise.resolve();
    },
    backButtonConfig : {
      routerState : new RouterState('welcome'),
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.LOGIN.TITLE'},
    }
  },

  {
    name : 'register',
    pattern : '/register',
    beforeEnter : accountRedirectIfLoggedIn,
    backButtonConfig : {
      routerState : new RouterState('welcome'),
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.REGISTER.TITLE'},
    }
  },

  {
    name : 'registerFormPage',
    pattern : '/register-form',
    beforeEnter : accountRedirectIfLoggedIn,
    onEnter: (fromState, toState, {rootStore}) => {
      rootStore.createRegisterStore();
      rootStore.ui.setLayout('normal');
      return Promise.resolve();
    },
    onExit : (fromState, toState, {rootStore}) => {
      rootStore.disposeRegisterStore();
      return Promise.resolve();
    },
    backButtonConfig : {
      routerState : new RouterState('register'),
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.REGISTER_FORM_PAGE.TITLE'},
    }
  },

  {
    name : 'activate',
    pattern: '/activation/:outcome',
    beforeEnter: accountRedirectIfLoggedIn,
    onEnter: (fromState, toState, {rootStore}) => {
      rootStore.createLoginStore();
      rootStore.ui.setLayout('normal');
      return Promise.resolve();
    },
    onExit : (fromState, toState, {rootStore}) => {
      rootStore.disposeLoginStore();
      return Promise.resolve();
    },
    backButtonConfig : {
      routerState : new RouterState('welcome'),
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.ACTIVATE.TITLE'},
    }
  },

  {
    name : 'recoverPass',
    pattern: '/recover-password',
    beforeEnter: accountRedirectIfLoggedIn,
    onEnter : (fromState, toState, {rootStore}) => {
      rootStore.createRecoverPassStore();
      rootStore.ui.setLayout('normal');
      return Promise.resolve();
    },
    onExit : (fromState, toState, {rootStore}) => {
      rootStore.disposeRecoverPassStore();
      rootStore.recoverPassView = null;
    },
    backButtonConfig : {
      routerState : new RouterState('welcome'),
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.RECOVER_PASS.TITLE'},
    }
  },

  {
    name: 'recoverPassConfirm',
    pattern: '/recover-password/confirm/:uid/:token',
    beforeEnter: accountRedirectIfLoggedIn,
    onEnter: (fromState, toState, {rootStore}) => {
      rootStore.createLoginStore();
      rootStore.createRecoverPassConfirmStore();
      rootStore.ui.setLayout('normal');
      return Promise.resolve();
    },
    onExit : (fromState, toState, {rootStore}) => {
      rootStore.disposeLoginStore();
      return Promise.resolve();
    },
    backButtonConfig : {
      routerState : new RouterState('welcome'),
      showBackButton : true,
    },
    metaData : {
      title : {id : 'METADATA.RECOVER_PASS_CONFIRM.TITLE'},
    }
  },

  {
    name: 'settings',
    pattern: '/settings/:page?',
    onEnter: (fromState, toState, {rootStore}) => {
      if (!rootStore.user.isSignedIn) {
        const newToState = new RouterState('login');
        callEnterHooks(fromState, newToState, rootStore);
        return Promise.reject(newToState);
      } else {
        rootStore.createSettingsStore();
        rootStore.ui.setLayout('normal');
        return Promise.resolve();
      }
    },
    onExit: (fromState, toState, {rootStore}) => {
      rootStore.disposeSettingsStore();
    },
    backButtonConfig : (routeState, rootStore) => ({
      routerState : new RouterState('profile', {username: rootStore.user.data.username}),
      showBackButton : true,
    }),
    metaData : {
      title : {id : 'METADATA.SETTINGS.TITLE'},
    }
  },

  /* CAMPAIGN EDIT */
  {
    name : 'campaignForm',
    pattern : '/mapeo/:id',
    onEnter: (fromState, toState, {rootStore}) => {
      rootStore.ui.setLayout('normal');
      rootStore.createCampaignFormStore(toState.params.id);
      return Promise.resolve();
    },
    backButtonConfig : (routeState, rootStore) => ({
      routerState: new RouterState('campaign', {
        username : rootStore.user.data.username,
        slug : rootStore.campaignForm.campaign.get('slug')
      }),
      showBackButton :  true,
    }),
    metaData : {
      title : {id : 'METADATA.CAMPAIGN_FORM.TITLE'},
      description : {id : 'METADATA.CAMPAIGN_FORM.DESCRIPTION'}
    }
  },

  {
    name : 'profile',
    pattern: '/:username',
    onEnter: (fromState, toState, {rootStore}) => {
      rootStore.createProfileStore(toState.params.username);
      rootStore.ui.setLayout('normal');
      return Promise.resolve();
    },
    onExit: (fromState, toState, {rootStore}) => {
      !!rootStore.profileView && !!rootStore.profileView.dispose && rootStore.profileView.dispose();
      rootStore.profileView = null;
      return Promise.resolve();
    },
    backButtonConfig : {
      routerState : new RouterState('home'),
      showBackButton : false,
    },
    isServerSideAsync : true
  },

  /* CAMPAIGNS - TAGS */
  {
    name : 'campaign',
    pattern: '/:username/:slug',
    onEnter: (fromState, toState, {rootStore}) => {
      if (isSamePath(fromState, toState)) return Promise.resolve();
      rootStore.ui.forceNavShadow = true;
      rootStore.ui.setLayout('mapping');
      const campaignView = rootStore.createCampaignViewStore();
      campaignView.loadView(toState.params.username, toState.params.slug);
      return Promise.resolve();
    },
    beforeExit : (fromState, toState, {rootStore}) => {
      if (isSamePath(fromState, toState)) return Promise.resolve();
      rootStore.ui.forceNavShadow = false;
      rootStore.disposeCampaignViewStore();
      return Promise.resolve();
    },
    backButtonConfig : (routeState, rootStore) => {
      const visualIsOpen = rootStore.campaignView.layoutMode == 'visual';
      const contentIsDetail = rootStore.campaignView.contentViewMode == 'detail-view';

      // is root
      if (!visualIsOpen && !contentIsDetail) {
        return {
          routerState: new RouterState('home'),
          showBackButton : false,
        }
      } else if (visualIsOpen && !contentIsDetail) {
        return {
          callback : () => rootStore.campaignView.setLayout('content'),
          showBackButton : true,
        }
      } else if ( visualIsOpen && contentIsDetail) {
        return {
          callback : () => rootStore.campaignView.setLayout('content'),
          showBackButton : true,
        }
      } else if (contentIsDetail) {
        let newQueryParams = _.omit(routeState.queryParams, 'dateo');
        return {
          routerState : new RouterState('campaign', routeState.params, newQueryParams),
          showBackButton : true
        }
      }
    },
    isServerSideAsync : true,
  },

  /* 404 */
  {
    name : 'notFound',
    pattern: 'not-found-ww404',
    onEnter: layoutToNormal,
    metaData : {
      title : {id : 'METADATA.NOT_FOUND.TITLE'},
      description : {id : 'METADATA.NOT_FOUND.DESCRIPTION'}
    }
  }
];

export default Views;
