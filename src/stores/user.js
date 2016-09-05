import {observable, action, computed, autorun, runInAction, toJS} from 'mobx';
import config from '../config';
import {fetch, OAuth} from '../utils';
import UI from './ui';
import {setLanguageFile} from '../i18n';
import {getCurrentLocale} from '../i18n/utils';

class UserStore {

  @observable data = {};
  @observable apiKey = '';
  @observable isNew = false;
  @observable locale = getCurrentLocale();

  @computed get isSignedIn() {
    return !!this.apiKey && !!this.data.id && this.data.status == 1;
  }
  @computed get image() {
    return this.data.image ? config.api.imgUrl+this.data.image : '';
  }
  @computed get smallImage() {
    return this.data.image_small ? config.api.imgUrl+this.data.image_small : '';
  }
  @computed get largeImage() {
    return this.data.image_large ? config.api.imgUrl+this.data.image_large : '';
  }

  constructor() {
    this.getFromLocal();
    this.getFromServer();
    this.syncUserToLS = autorun(() => {
      if (!!this.apiKey) {
        localStorage.setItem('apiKey', this.apiKey);
        localStorage.setItem('user', JSON.stringify(this.data));
      } else {
        localStorage.removeItem('apiKey');
        localStorage.removeItem('user');
      }
    });

    this.syncLangToLS = autorun(() => localStorage.setItem('locale', this.locale));
  }

  /***************
   ACTIONS
  ***************/

  @action socialSignIn(party) {
    return new Promise((resolve, reject) => {
      UI.setLoading(true);
      OAuth.popup(party)
      .done(result => {
        let params = {party};
        if (party == 'facebook') {
          params.access_token = result.access_token;
        } else if (party == 'twitter') {
          params.oauth_token = result.oauth_token;
          params.oauth_token_secret = result.oauth_token_secret;
        }

  			const url = config.api.url + 'account/socialauth/'+party+'/';
        fetch.post(url, params)
        .then(result => runInAction(() => {
          UI.setLoading(false);
          this.loadUser(result.body.user, result.body.token, result.body.is_new);
          resolve(result.body.user);
        }))
        .catch(err => runInAction(() => {
          UI.setLoading(false);
          reject(err);
        }));
  		})
      .fail(err => {
        UI.setLoading(false);
        reject(err);
      });
    });
  }

  @action login(data) {
    return new Promise((resolve, reject) => {
      UI.setLoading(true);
      fetch.post(config.api.url+'account/signin/', data)
      .then( res => runInAction(() => {
        UI.setLoading(false);
        this.loadUser(res.body.user, res.body.token, false);
        resolve(res.body.user);
      }))
      .catch(err => {
        UI.setLoading(false);
        reject(err);
      })
    });
  }

  @action register(data) {
    return new Promise((resolve, reject) => {
      UI.setLoading(true);
      Object.assign(data, {
        success_redirect_url : config.app.url + '/update-user',
		    error_redirect_url   : config.app.url
      });
      fetch.post(config.api.url+'account/register/', data)
      .then( res => runInAction(() => {
        UI.setLoading(false);
        this.loadUser(res.body.user, res.body.token, false);
        resolve(res.body.user);
      }))
      .catch(err => {
        UI.setLoading(false);
        reject(err);
      })
    });
  }

  @action loadUser(user, apiKey, isNew) {
    this.data   = user;
    this.apiKey = apiKey;
    this.isNew  = isNew;
  }

  @action getFromLocal() {
    const apiKey = localStorage.getItem('apiKey');
    const user   = JSON.parse(localStorage.getItem('user'));
    if (!!apiKey && !!user) {
      this.apiKey = apiKey;
      this.data   = user;
    }
  }

  @action getFromServer() {
    if (!this.data.id) return;
    fetch.get(config.api.url+'user/'+this.data.id+'/')
    .then(res => runInAction(() => this.data = res.body))
  }

  @action setLocale(loc) {
    if (loc != this.locale) {
      if (this.data.id) this.data.language = loc;
      this.locale = loc;
    }
  }

  @action signOut() {
    this.apiKey = '';
    this.data   = {};
  }
}

let singleton = new UserStore();
export default singleton;
