import {observable, action, computed, runInAction} from 'mobx';
import validator from 'validator';

export default class RecoverPassView {

  @observable email = '';
  @observable error = '';
  @observable success = false;
  @observable resubmitted = false;

  @computed get isValid() {
    return !!this.email && validator.isEmail(this.email);
  }

  constructor(main) {
    this.main = main;
  }

  @action setEmail = email => {
    this.email = email;
  }

  @action submit = () => {
    this.error = '';
    this.main.user.resetPassword(this.email)
      .then(res => runInAction(() => {this.success = true}))
      .catch(err => runInAction(() => {
        switch (err.response.status) {
          case 400:
            this.error = 'ACCOUNT_MSG.RESET_NOT_FOUND';
            break;
          case 401:
            this.error = 'ACCOUNT_MSG.BLOCKED';
            break;
          case 500:
            this.error = 'ERROR.UNKNOWN';
            break;
        }
      }))
  }

  @action resubmit = () => {
    this.error = '';
    this.main.user.resetPassword(this.email)
    .then(res => runInAction(() => {this.resubmitted = true}))
    .catch(err => runInAction( () => {this.error = 'ERROR.UNKNOWN'}))
  }



}
