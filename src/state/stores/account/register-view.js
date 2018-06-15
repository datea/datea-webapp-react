import {observable, action, computed, runInAction} from 'mobx';
import validator from 'validator';
import _ from 'lodash';
import config from '../../../config';
import {emailExists, usernameExists} from '../../../utils';

export default class RegisterView {

  @observable username = '';
  @observable email = '';
  @observable password = '';
  @observable passConfirm = '';
  @observable error = new Map();
  @observable success = false;

  @computed get isValid(){
    return !!this.username && !!this.email && !!this.password && !!this.passConfirm && !this.error.size;
  }

  constructor(main) {
    this.main = main;
  }

  @action setUsername = uname => {
    this.username = uname;
    this.validateUsername();
  };
  @action setEmail = email => {
    this.email = email;
    this.validateEmail();
  };
  @action setPassword = pw => {
    this.password = pw;
    this.validatePassword();
  };
  @action setPassConfirm = pw => {
    this.passConfirm = pw;
    this.validatePassConfirm();
  };

  @action _validateUsername = () => {
    if (this.username.length < config.validation.username.minLength || this.username.length > config.validation.username.maxLength) {
      this.error.set('username', 'REGISTER_FORM_PAGE.USERNAME_LENGTH');
    } else if (!validator.isAlphanumeric(this.username)) {
      this.error.set('username', 'REGISTER_FORM_PAGE.USERNAME_ALPHANUM');
    } else {
      usernameExists(this.username)
      .then(res => runInAction(() => {
        res.body.result
        ? this.error.set('username', 'ACCOUNT_MSG.DUPLICATE_USER')
        : this.error.delete('username');
      }))
    }
  }
  validateUsername = _.debounce(this._validateUsername, config.validation.debounceMs);


  @action _validateEmail = () => {
    if (!validator.isEmail(this.email)) {
      this.error.set('email', 'ACCOUNT_MSG.EMAIL_INVALID');
    }else {
      emailExists(this.email)
      .then( res => runInAction(() => {
        res.body.result
        ? this.error.set('email', 'ACCOUNT_MSG.EMAIL_EXISTS')
        : this.error.delete('email');
      }));
    }
  }
  validateEmail = _.debounce(this._validateEmail, config.validation.debounceMs);


  @action _validatePassword = () => {
    if (!this.password.match(config.validation.password.regex)) {
      this.error.set('password', 'REGISTER_FORM_PAGE.PASS_DESC');
    } else {
      this.error.delete('password');
    }
  }
  validatePassword = _.debounce(this._validatePassword, config.validation.debounceMs);


  @action _validatePassConfirm = () => {
    this.passConfirm != this.password
    ? this.error.set('passConfirm', 'REGISTER_FORM_PAGE.PASS_REPEAT_ERROR')
    : this.error.delete('passConfirm')
  }
  validatePassConfirm = _.debounce(this._validatePassConfirm, config.validation.debounceMs);

  @action save = () => {
    if (this.isValid) {
      this.main.user.register({
        username: this.username,
        email : this.email,
        password : this.password
      })
      .then(res => {
        console.log('success', res);
        this.success = true;
      })
      .catch(err => this.error.set('main', 'ERROR.UNKNOWN'))
    }
  }
}
