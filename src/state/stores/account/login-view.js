import {observable, action, computed, runInAction} from 'mobx';

export default class LoginView {

  @observable username = '';
  @observable password = '';
  @observable error = '';

  @computed get isValid() {
    return !!this.username && !!this.password;
  }

  constructor(main) {
    this.main = main;
  }

  @action setUsername = uname => {
    this.username = uname;
  }

  @action setPassword = pass => {
    this.password = pass;
  }

  @action login = (onSuccess) => {
    this.error = '';
    // TODO: put this logic into the store, error inclusive
    this.main.user.login({
      username : this.username,
      password : this.password
    })
    .then(res => {
      if (onSuccess && typeof onSuccess == 'function') {
        onSuccess(res);
      } else {
        if (!this.main.user.isNew) {
          const lastRoute = this.main.user.lastLoggedOutRoute;
          if (lastRoute) {
            this.main.router.goTo(lastRoute);
          } else {
            this.main.router.goTo('home');
          }
        }else{
          this.main.router.goTo('settings' ,{page: 'welcome'});
        }
      }
    })
    .catch(err => {
      console.log(err);
      if (err.response && err.response.status == 404) {
        this.error = 'ACCOUNT_MSG.LOGIN_ERROR';
      } else {
        this.error = 'ERROR.UNKNOWN';
      }
    });
  }


}
