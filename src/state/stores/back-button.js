import {observable, action, reaction} from 'mobx';
import {routerStateToUrl} from 'mobx-state-router';
import config from '../../config';

export default class BackButtonStore {

  backAction = null;
  @observable showBackButton = true;

  constructor(main) {
    this.main = main;

    setTimeout(() => {
      this.listenToRoute = reaction(
        () => routerStateToUrl(this.main.router, this.main.router.routerState),
        () => this.updateBackButtonConfig(),
        {fireImmediately : true, delay: 1}
      );
    }, 300);
  }

  @action updateBackButtonConfig = () => {
    const route = this.main.router.getCurrentRoute();
    if (!route) return;

    let config = route.backButtonConfig;
    if (typeof(config) == 'function') {
      config = config(this.main.router.routerState, this.main);
    }

    this.showBackButton = (!!config && config.showBackButton) || false;
    this.backAction = !!config ? Object.assign({}, config) : null;
  }

  @action goBack = () => {
    if (this.backAction) {
      if (this.backAction.callback) {
        this.backAction.callback();
      } else if (this.backAction.routerState) {
        const {routerState} = this.backAction;
        this.main.router.goTo(routerState);
      }
    }
  }
}
