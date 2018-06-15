import {observable, action, computed, runInAction} from 'mobx';
import validator from 'validator';
import config from '../../../config';
import _ from 'lodash';

export default class RecoverPassConfirmView {

  @observable password = '';
  @observable passwordConfirm = '';
  @observable success = false;
  @observable error = new Map();
  @observable errorCode = null;

  @computed get isValid() {
    return !!this.password && !!this.password.match(config.validation.password.regex) && this.password == this.passwordConfirm;
  }

  constructor(main) {
    this.main = main;
  }

  @action setPassword = pw => {
    this.password = pw;
    this.validatePassword();
  }

  @action setPasswordConfirm = pw => {
    this.passwordConfirm = pw;
    this.validatePasswordConfirm();
  }

  @action _validatePassword = () => {
    if (!this.password || !this.password.match(config.validation.password.regex)) {
      this.error.set('password', 'REGISTER_FORM_PAGE.PASS_DESC');
    } else {
      this.error.delete('password');
    }
  }
  validatePassword = _.debounce(this._validatePassword, config.validation.debounceMs);

  @action _validatePasswordConfirm = () => {
    if (this.password != this.passwordConfirm) {
      this.error.set('passwordConfirm', 'REGISTER_FORM_PAGE.PASS_REPEAT_ERROR');
    } else {
      this.error.delete('passwordConfirm');
    }
  }
  validatePasswordConfirm = _.debounce(this._validatePasswordConfirm, config.validation.debounceMs);

  @action submit = () => {
    this.error.clear();
    this.errorCode = null;
    const {params} = this.main.router.routerState;
    const data = {
      uid      : params.uid,
      token    : params.token,
      password : this.password
    }
    this.main.user.confirmResetPassword(data)
    .then(res => runInAction(() => {this.success = true}))
    .catch(err => {
      switch (err.response.status) {
        case 400:
          this.error.set('main', 'PASSW_PAGE.ERROR_MSG');
          this.errorCode = 400;
          break;
        case 401:
          this.error.set('main', 'ACCOUNT_MSG.BLOCKED');
          this.errorCode = 401;
          break;
        default:
          this.error.set('main', 'ERROR.UNKNOWN');
          this.errorCode = 500
      }
    })
  }
}
