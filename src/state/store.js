import {autorun, reaction, computed, observable, toJS} from 'mobx';
import {RouterStore} from 'mobx-router/src';
import DataStore from './stores/data';
import UIStore from './stores/ui';
import UserStore from './stores/user';
import Views from './views';

import CampaignViewStore from './stores/campaign-view';
import CampaignFormStore from './stores/campaign-form';
import ProfileViewStore from './stores/profile-view';
import DateoStore from './stores/dateo';
import DateoFormStore from './stores/dateo-form';


export default class DateaStore {

  @observable datearMode = 'closed';

  constructor() {
    this.router = new RouterStore();
    this.ui = new UIStore(this);
    this.user = new UserStore(this);
    this.data = new DataStore(this);
    this.dateo = new DateoStore(this);
    this.initListenToDateoForm();
  }

  /* DATEO FORM MAIN ACTIONS: TODO EVALUATE WHERE TO PUT THIS */
  openDateoForm = (id) => {
    const queryParams  = toJS(this.router.queryParams);
    queryParams.datear = id || 'new';
    this.router.goTo(this.router.currentView, this.router.params, this, queryParams);
  }

  cancelDateoForm = () => {
    const queryParams  = toJS(this.router.queryParams);
    delete queryParams.datear;
    this.goTo(this.router.currentView.name, this.router.params, queryParams);
  }

  initListenToDateoForm = () => {
    this.listenDateoForm = reaction(
      () => this.router.queryParams && this.router.queryParams.datear,
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

  openDateo = ({dateo, isNew = false}) => {
    if (!dateo) return;
    if (!!dateo && ['string', 'number']. includes(typeof (dateo))) {
      dateo = this.dateo.data.dateos.get(String(dateo));
    }
    if (!dateo) return;

    const dateoId = String(dateo.id);

    const viewName = !!this.router.currentView && this.router.currentView.name;
    const queryParams = toJS(this.router.queryParams);
    queryParams.dateo = dateo.id;
    if (queryParams.datear) {
      delete queryParams.datear;
    }
    switch (viewName) {
      case 'campaign':
        this.campaignView.setLayout('content');
        this.goTo('campaign', this.router.params, queryParams);
        this.ui.setLoading(false);
        break;
    }
  }

  closeDateo = () => {
    const queryParams  = toJS(this.router.queryParams);
    if (queryParams.dateo) {
      delete queryParams.dateo;
    }
    this.router.goTo(this.router.currentView, this.router.params, this, queryParams);
  }

  getDatearContext() {
    if (this.router.currentView.name == 'campaign') {
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
    if (!replace) {
      queryParams = Object.assign({}, this.router.queryParams, queryParams);
    }
    this.goTo(this.router.currentView, this.router.params, queryParams);
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


  goTo = (view, paramsObject, queryParamsObject) => {
    view = typeof(view) == 'string' ? Views[view] : view;
    this.router.goTo(view, paramsObject, this, queryParamsObject);
  }

  /************** PROFILE *******************/
  createProfileStore = (username) => {
    this.profileView = new ProfileViewStore(this, username);
  }
}
