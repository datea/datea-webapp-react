import {observable, action} from 'mobx';
import config from '../../config';

export default class BackButtonStore {

  @observable backViewParams = [];
  @observable showBackButton = true;

  constructor(main) {
    this.main = main;
  }

  @action setBackView = (backView, showBackButton = true) => {
    this.backViewParams.replace(Array.isArray(backView) ? backView : [backView]);
    this.showBackButton = showBackButton;
  }

  @action addBackView = (backView, showBackButton = true) => {
    this.backViewParams.push(backView);
    this.showBackButton = showBackButton;
  }

  @action goBack = () => {
    if (this.backViewParams.length) {
      const view = this.backViewParams.pop();
      this.main.goTo(view.viewId, view.params, view.queryParams);
    } else {
      window.history.back();
    }
  }
}
