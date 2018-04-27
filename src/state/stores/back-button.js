import {observable, action, reaction} from 'mobx';
import config from '../../config';

export default class BackButtonStore {

  backAction = null;
  @observable showBackButton = true;

  constructor(main) {
    this.main = main;

    setTimeout(() => {
      this.listenToRoute = reaction(
        () => {
          if (this.main.router.currentView) {
            return this.main.router.currentView.replaceUrlParams(this.main.router.params, this.main.router.queryParams);
          } else {
            return false;
          }
        },
        () => this.updateBackButtonConfig(),
        {fireImmediately : true, delay: 1}
      );
    }, 300);
  }

  @action updateBackButtonConfig = () => {
    const currentView = this.main.router.currentView;
    if (!currentView) return;

    let config = currentView.backButtonConfig;
    if (typeof(config) == 'function') {
      config = config(currentView, this.main.router.params, this.main, this.main.router.queryParams);
    }

    this.showBackButton = (!!config && config.showBackButton) || false;
    this.backAction = !!config ? Object.assign({}, config) : null;
  }

  @action goBack = () => {
    if (this.backAction) {
      if (this.backAction.callback) {
        this.backAction.callback();
      } else if (this.backAction.view) {
        const {view, params, queryParams} = this.backAction;
        this.main.goTo(view, params, queryParams);
      }
    }
  }
}
