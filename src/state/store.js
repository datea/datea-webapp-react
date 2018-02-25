import {RouterStore} from 'mobx-router';
import DataStore from './stores/data';
import UIStore from './stores/ui';
import UserStore from './stores/user';
import Views from './views';

import CampaignViewStore from './stores/campaign-view';
import DateoStore from './stores/dateo';

export default class DateaStore {

  constructor() {
    this.router = new RouterStore();
    this.ui = new UIStore(this);
    this.user = new UserStore(this);
    this.data = new DataStore(this);
    this.dateo = new DateoStore(this);
    this.campaignView = new CampaignViewStore(this);
  }

  goTo(view, paramsObject, queryParamsObject) {
    view = typeof(view) == 'string' ? Views[view] : view;
    this.router.goTo(view, paramsObject, this, queryParamsObject);
  }
}
