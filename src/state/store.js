import {autorun, computed, toJS} from 'mobx';
import {RouterStore} from 'mobx-router/src';
import DataStore from './stores/data';
import UIStore from './stores/ui';
import UserStore from './stores/user';
import Views from './views';

import CampaignViewStore from './stores/campaign-view';
import CampaignFormStore from './stores/campaign-form';
import DateoStore from './stores/dateo';
import DateoFormStore from './stores/dateo-form';


export default class DateaStore {

  constructor() {
    this.router = new RouterStore();
    this.ui = new UIStore(this);
    this.user = new UserStore(this);
    this.data = new DataStore(this);
    this.dateo = new DateoStore(this);
    this.campaignView = new CampaignViewStore(this);

    this.queryParamsAutorun = autorun( () => {
      if (this.router.queryParams && this.router.queryParams.datear) {
        this.createDateoFormStore(this.router.queryParams.datear);
      }
    })
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

  openDateo = ({dateo, isNew = false}) => {
    if (!!dateo && !dateo.id) {
      dateo = this.dateo.data.dateos.get(dateo);
    }
    if (!dateo) return;

    this.dateo.data.detail = dateo;
    this.dateo.data.detail.isNew = isNew;
    const viewName = !!this.router.currentView && this.router.currentView.name;
    const queryParams = toJS(this.router.queryParams);
    queryParams.dateo = dateo.id;
    if (queryParams.datear) {
      delete queryParams.datear;
    }
    switch (viewName) {
      case 'campaign':
        this.goTo('campaign', this.router.params, queryParams);
        if (this.campaignView.layoutMode == 'visual') {
          this.campaignView.setLayout('content');
          setTimeout(() => this.campaignView.map.navigateToDateo(dateo.id), 50);
        } else {
          this.campaignView.map.navigateToDateo(dateo.id);
        }
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

  updateQueryParams = (queryParams, replace = true) => {
    if (!replace) {
      queryParams = Object.assign({}, this.router.queryParams, queryParams);
    }
    this.goTo(this.router.currentView, this.router.params, queryParams);
  }

  createDateoFormStore = (id) => {
    if (this.dateoForm) {
      this.dateoForm.dispose();
      this.dateoForm = null;
    }
    this.dateoForm = new DateoFormStore(this, id);
  }
  /**********************************/

  /*** CAMPAIGN FORM *****/
  createCampaignFormStore = (id) => {
    this.campaignForm = new CampaignFormStore(this, id);
  }


  goTo = (view, paramsObject, queryParamsObject) => {
    view = typeof(view) == 'string' ? Views[view] : view;
    this.router.goTo(view, paramsObject, this, queryParamsObject);
  }
}
