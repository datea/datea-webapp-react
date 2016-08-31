import {observable, action, computed, autorun, runInAction} from 'mobx';
import config from '../config';
import {fetch, OAuth} from '../utils';
import UI from './ui';

class UserStore {

  @observable data = {};
  @observable apiKey = '';
  @observable isNew = false;

  @computed get isSignedIn() {
    return !!this.apiKey && !!this.data.id;
  }
  @computed get image() {
    return config.api.imgUrl+this.data.image;
  }
  @computed get smallImage() {
    return config.api.imgUrl+this.data.image_small;
  }
  @computed get largeImage() {
    return config.api.imgUrl+this.data.image_large;
  }

  constructor() {
    this.getFromLocal();
    this.syncToLocal = autorun(() => {
      if (!!this.apiKey) {
        localStorage.setItem('apiKey', this.apiKey);
        localStorage.setItem('user', JSON.stringify(this.data));
      } else {
        localStorage.removeItem('apiKey');
        localStorage.removeItem('user');
      }
    });
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
        console.log('res', res);
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

  @action signOut() {
    this.apiKey = '';
    this.data   = {};
  }
}

let singleton = new UserStore();
export default singleton;
