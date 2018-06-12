import {autorun, action, reaction, computed, observable, toJS, runInAction, when} from 'mobx';
import { RouterState, RouterStore } from 'mobx-state-router';
import UIStore from './stores/ui';
import UserStore from './stores/user';
import SearchBar from './stores/search-bar';
import BackButton from './stores/back-button';
import MetaData from './stores/meta-data';
import Views from './views';

import HomeViewStore from './stores/home-view';
import SearchMappingViewStore from './stores/search-mapping-view';
import CampaignViewStore from './stores/campaign-view';
import CampaignFormStore from './stores/campaign-form';
import ProfileViewStore from './stores/profile-view';
import DateoStore from './stores/dateo';
import DateoFormStore from './stores/dateo-form';

export default class DateaStore {

  @observable datearMode = 'closed';
  @observable isServerSideReady = false;
  hostname = '';

  constructor() {
    const notFound = new RouterState('notFound');
    this.router = new RouterStore(this, Views, notFound);
    this.ui = new UIStore(this);
    this.user = new UserStore(this);
    this.dateo = new DateoStore(this);
    this.searchBar = new SearchBar(this);
    this.backButton = new BackButton(this);
    this.metaData = new MetaData(this);
    this.initListenToDateoForm();
    this.initMetaDataTracking();
  }

  /* DATEO FORM MAIN ACTIONS: TODO EVALUATE WHERE TO PUT THIS */
  openDateoForm = (id) => {
    const rState = this.router.routerState;
    const queryParams  = Object.assign({} , rState.queryParams || {});
    queryParams.datear = id || 'new';
    this.router.goTo(rState.routeName, rState.params, queryParams);
  }

  cancelDateoForm = () => {
    const rState = this.router.routerState;
    const queryParams  = Object.assign({} , rState.queryParams || {});
    delete queryParams.datear;
    this.router.goTo(rState.routeName, rState.params, queryParams);
  }

  initListenToDateoForm = () => {
    this.listenDateoForm = reaction(
      () => this.router.routerState.queryParams && this.router.routerState.queryParams.datear,
      val => {
        if (val) {
          this.dateoForm = new DateoFormStore(this, val);
          this.datearMode = val;
        } else {
          this.datearMode = 'closed';
          if (this.dateoForm) {
            this.dateoForm.dispose();
            this.dateoForm = null;
          }
        }
      }
    );
  }

  @action openDateo = ({dateo, isNew = false}) => {
    console.log('openDateo', dateo);
    if (!dateo) return;
    if (!!dateo && ['string', 'number']. includes(typeof (dateo))) {
      dateo = this.dateo.dateos.get(dateo);
    }
    if (!dateo) return;

    const rState = this.router.routerState;
    let queryParams = {...rState.queryParams};
    queryParams.dateo = dateo.id;
    if (queryParams.datear) {
      delete queryParams.datear;
    }
    switch (rState.routeName) {
      case 'campaign':
        this.campaignView.setLayout('content');
        setTimeout(() => runInAction(() => {
          // ver si se está filtrando
          if (queryParams.tags) {
            const activeTags = queryParams.tags.split(',');
            let tagIncluded = false;
            for (let tag of dateo.tags) {
              if (activeTags.includes(tag)) {
                tagIncluded = true;
                break;
              }
            }
            if (!tagIncluded) {
              delete queryParams.tags
            }
          }
          if (queryParams.q) {
            delete queryParams.q;
          }
          const newState = new RouterState('campaign', rState.params, queryParams);
          this.router.goTo(newState);
          this.ui.setLoading(false);
        }));
        break;
    }
  }

  closeDateo = () => {
    const rState = this.router.routerState;
    const queryParams  = {...rState.queryParams};
    if (queryParams.dateo) {
      delete queryParams.dateo;
    }
    this.router.goTo(rState.routeName, rState.params, queryParams);
  }

  getDatearContext() {
    if (this.router.getCurrentRoute().name == 'campaign') {
      return {
        type: 'campaign',
        data : this.campaignView.data.campaign
      }
    } else {
      return {
        type : 'user',
        data : this.user.data
      }
    }
    return null;
  }

  updateQueryParams = (queryParams, replace = true) => {
    const rState = this.router.routerState;
    if (!replace) {
      queryParams = {...rState.queryParams, ...queryParams};
    }
    this.router.goTo(rState.routeName, rState.params, queryParams);
  }

  /****** HOME / LANDING ******/
  createHomeViewStore = () => {
    this.homeView = new HomeViewStore(this);
  }

  /******* MAPPING SEARCH *******/
  createSearchMappingViewStore = () => {
    this.searchMappingView = new SearchMappingViewStore(this);
  }

  /****** CAMPAIGN *******/
  createCampaignViewStore = () => {
    this.campaignView = new CampaignViewStore(this);
    return this.campaignView;
  }

  disposeCampaignViewStore = () => {
    !!this.campaignView && this.campaignView.dispose();
    this.campaignView = null;
  }

  /*** CAMPAIGN FORM *****/
  createCampaignFormStore = (id) => {
    this.campaignForm = new CampaignFormStore(this, id);
  }

  /************** PROFILE **********************/
  createProfileStore = (username) => {
    this.profileView = new ProfileViewStore(this, username);
  }

  setServerSideReady = () => {
    setTimeout(() => { this.isServerSideReady = true;});
  }

  /************* SERVER SIDE ASYNC *************/
  initMetaDataTracking = () => {
    autorun(() => {
      const route = this.router.getCurrentRoute();
      if (route && route.name != '__initial__' && !route.isServerSideAsync) {
        this.metaData.set(route.metaData || {});
      }
    })
  }

  setHostName = (name) => {
    this.hostname = name;
  }

  getHostName = () => {
    return ENV_TYPE == 'browser' ? location.hostname : this.hostname;
  }

  serverSideWaitAsync = async () => new Promise((resolve, reject) => {
    when(() => !!this.router.routerState, () => {
      const route = this.router.getCurrentRoute();
      if (!route.isServerSideAsync) {
        this.metaData.set(route.metaData || {});
        resolve();
      } else {
        this.isServerSideReady = false;
        when(() => this.isServerSideReady, () => {
          resolve();
        });
      }
    })
  });
}
