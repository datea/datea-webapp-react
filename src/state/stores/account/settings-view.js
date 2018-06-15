import {observable, action, computed, runInAction, extendObservable, toJS} from 'mobx';
import validator from 'validator';
import _ from 'lodash';
import config from '../../../config';
import {emailExists, usernameExists} from '../../../utils';


export default class SettingsView {

  @observable user = {};
  @observable password = '';
  @observable passConfirm = '';
  @observable error = new Map();
  @observable showChangePassword = false;
  @observable emailDialogOpen = false;

  @computed get isValid() {
    return !!this.user.username && !!this.user.email && !this.error.size && ((this.showChangePassword && !!this.password) || !this.showChangePassword );
  }

  constructor(main) {
    this.main = main;
    extendObservable(this.user, toJS(this.main.user.data));
  }

  @action setUsername = uname => {
    this.user.username = uname;
    this.validateUsername();
  }

  @action setEmail = email => {
    this.user.email = email;
    this.validateEmail();
  }
  @action setPassword = pw => {
    this.password = pw;
    this.validatePassword();
  };
  @action setPassConfirm = pw => {
    this.passConfirm = pw;
    this.validatePassConfirm();
  };

  @action _validateUsername = () => {
    if (this.user.username == this.main.user.data.username) {
      this.error.delete('username');
    } if (this.user.username.length < config.validation.username.minLength || this.user.username.length > config.validation.username.maxLength) {
      this.error.set('username', 'REGISTER_FORM_PAGE.USERNAME_LENGTH');
    } else if (!validator.isAlphanumeric(this.user.username)) {
      this.error.set('username', 'REGISTER_FORM_PAGE.USERNAME_ALPHANUM');
    } else {
      usernameExists(this.user.username)
      .then(res => runInAction(() => {
        res.body.result
        ? this.error.set('username', 'ACCOUNT_MSG.DUPLICATE_USER')
        : this.error.delete('username');
      }))
    }
  }
  validateUsername = _.debounce(this._validateUsername, config.validation.debounceMs);


  @action _validateEmail = () => {
    if (this.user.email == this.main.user.data.email) {
      this.error.delete('email');
    } else if (!validator.isEmail(this.user.email)) {
      this.error.set('email', 'ACCOUNT_MSG.EMAIL_INVALID');
    }else {
      emailExists(this.user.email)
      .then( res => runInAction(() => {
        res.body.result
        ? this.error.set('email', 'ACCOUNT_MSG.EMAIL_EXISTS')
        : this.error.delete('email');
      }));
    }
  }
  validateEmail = _.debounce(this._validateEmail, config.validation.debounceMs);


  @action _validatePassword = () => {
    if (!this.password || !this.password.match(config.validation.password.regex)) {
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


  @action setImage = (imgRes) => {
    this.user.image = imgRes;
  }

  @action setBgImage = (imgRes) => {
    this.user.bg_image = imgRes;
  }

  @action setFullName = (name) => {
    console.log('name', name);
    this.user.full_name = name;
  }

  @action setUrl = (url) => {
    this.user.url = url.trim();
    this.validateUrl();
  }

  @action _validateUrl = () => {
    if (!this.user.url || !validator.isURL(this.user.url)) {
      this.error.set('url', "DATEAR.ERROR.URL_FORMAT");
    } else {
      this.error.delete('url');
    }
  }
  validateUrl = _.debounce(this._validateUrl, config.validation.debounceMs);

  @action setNotify = (field, checked) => {
    this.user.notify_settings[field] = checked;
  }


  @action toggleShowPassword = (val) => {
    if (typeof(val) == 'undefined') {
      this.showChangePassword = !this.showChangePassword;
    } else {
      this.showChangePassword = val;
    }
  }

  @action closeEmailDialog = () => {
    this.emailDialogOpen = false;
  }

  @action submit = (warnEmailChange = true) => {
    if (!this.isValid) return;
    this.emailDialogOpen = false;
    let model = toJS(this.user);
    if (this.showChangePassword) {
      model.password = this.password;
    }
    if (warnEmailChange && model.email != this.main.user.data.email) {
      this.emailDialogOpen = true;
    } else {
      this.main.user.save(model)
      .catch(err => {console.log(err); this.error.set('main','ERROR.UNKNOWN')});
    }
  }

}
