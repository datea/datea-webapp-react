import {observable, action, computed, autorun, runInAction, toJS} from 'mobx';
import urlJoin from 'url-join';
import moment from 'moment';
import config from '../../config';
import {fetch, OAuth} from '../../utils';
import {setLanguageFile} from '../../i18n';
import {getCurrentLocale} from '../../i18n/utils';


export default class UserStore {

  @observable data = {};
  @observable apiKey = '';
  @observable isNew = false;
  @observable locale = getCurrentLocale();
  @observable location = null;

  lastLoggedOutRoute = null;

  @computed get isSignedIn() {
    return !!this.apiKey && !!this.data.id && this.data.status == 1;
  }
  @computed get image() {
    return this.data.image ? urlJoin(config.api.imgUrl, this.data.image) : '';
  }
  @computed get smallImage() {
    return this.data.image_small ? urlJoin(config.api.imgUrl, this.data.image_small) : '';
  }
  @computed get largeImage() {
    return this.data.image_large ? urlJoin(config.api.imgUrl, this.data.image_large) : '';
  }

  constructor(main) {
    this.main = main;
    this.getFromLocal();
    this.getFromServer();

    if (ENV_TYPE == 'browser') {
      this.syncUserToLS = autorun(() => {
        if (!!this.apiKey) {
          localStorage.setItem('apiKey', this.apiKey);
          localStorage.setItem('user', JSON.stringify(this.data));
        } else {
          localStorage.removeItem('apiKey');
          localStorage.removeItem('user');
        }
      });
      this.syncLangToLS = autorun(() => {
        moment.locale(this.locale);
        localStorage.setItem('locale', this.locale);
      });
      this.startLocationTracker();
    }
  }

  startLocationTracker() {
    if (ENV_TYPE == 'browser') {
      const locReadyEvent = new Event('userLocationReady');
      this.locationTrackId = navigator.geolocation.watchPosition(
        ({coords}) => {
          this.setLocation({lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy});
          window.dispatchEvent(locReadyEvent);
        },
        error => {
          if (!this.location || !Object.keys(this.location).length) {
            // get IP location as fallback
            const url = urlJoin('https://api.datea.pe/api/v2', 'ip_location');
            fetch.get(url)
            .then(res => {
              const {latitude: lat, longitude : lng} = res.body.ip_location;
              this.setLocation({lat, lng, accuracy: config.geolocation.ipLocationAccuracy});
              window.dispatchEvent(locReadyEvent);
            })
            .catch(e => {
              console.log(e);
              //set location to false!
              this.location = false;
              window.dispatchEvent(locReadyEvent);
            })
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000
        }
      );
    }
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      if (this.location) {
        resolve(this.location);
      }else if (this.location === null) {
        if (ENV_TYPE == 'browser') {
          window.addEventListener('userLocationReady', () => {
            if (!this.location) {
              reject();
            } else {
              resolve(this.location);
            }
          }, {once: true});
        } else {
          reject();
        }
      } else {
        reject();
      }
    });
  }

  /***************
   ACTIONS
  ***************/

  getFacebookUser = userData => {
    const url = urlJoin(config.api.url, 'account/facebook-login');
    fetch.post(url, userData)
    .then(result => this.loadSocialUser(result.body))
    .catch(err => runInAction(() => {
      this.main.ui.setLoading(false);
    }));
  }

  @action loadSocialUser = (resultBody) => {

    this.main.ui.setLoading(false);
    this.loadUser(resultBody.user, resultBody.token, resultBody.is_new);

    if (!resultBody.is_new) {
      this.lastLoggedOutRoute;
      if (this.lastLoggedOutRoute && this.lastLoggedOutRoute.routeName != 'welcome') {
        this.main.router.goTo(this.lastLoggedOutRoute);
      } else {
        this.main.router.goTo('home');
      }
    }else{
      this.main.router.goTo('settings', {page: 'welcome'});
    }
  }

  @action login = (data) => {
    return new Promise((resolve, reject) => {
      this.main.ui.setLoading(true);
      fetch.post(urlJoin(config.api.url, 'account/signin/'), data)
      .then( res => runInAction(() => {
        this.main.ui.setLoading(false);
        this.loadUser(res.body.user, res.body.token, false);
        resolve(res.body.user);
      }))
      .catch(err => {
        console.log(err);
        this.main.ui.setLoading(false);
        reject(err);
      })
    });
  }

  @action register = (data) => {
    return new Promise((resolve, reject) => {
      this.main.ui.setLoading(true);
      Object.assign(data, {
        success_redirect_url : urlJoin(config.app.url, '/update-user'),
		    error_redirect_url   : config.app.url
      });
      fetch.post(urlJoin(config.api.url, 'account/register/'), data)
      .then( res => runInAction(() => {
        this.main.ui.setLoading(false);
        this.loadUser(res.body.user, res.body.token, false);
        resolve(res.body.user);
      }))
      .catch(err => {
        this.main.ui.setLoading(false);
        reject(err);
      })
    });
  }

  @action resetPassword = (email) => {
    return new Promise((resolve, reject) => {
      this.main.ui.setLoading(true);
      fetch.post(urlJoin(config.api.url,'account/reset-password/'), {email})
      .then(res => {
        this.main.ui.setLoading(false);
        resolve(res);
      })
      .catch(err => {
        this.main.ui.setLoading(false);
        reject(err);
      })
    });
  }

  @action confirmResetPassword = (params) => {
    return new Promise((resolve, reject) => {
      this.main.ui.setLoading(true);
      fetch.post(urlJoin(config.api.url, 'account/reset-password-confirm/'), params)
      .then(res => {
        this.main.ui.setLoading(false);
        resolve(res);
      })
      .catch(err => {
        this.main.ui.setLoading(false);
        reject(err);
      })
    })
  }

  @action save(params) {
    return new Promise((resolve, reject) => {
      this.main.ui.setLoading(true);
      fetch.patch(urlJoin(config.api.url, 'user', String(this.data.id)), params)
      .then(res => runInAction(() => {
        this.main.ui.setLoading(false);
        this.data = res.body;
        console.log(toJS(res.body));
        resolve(res.body);
      }))
      .catch(err => {
        this.main.ui.setLoading(false);
        reject(err);
      })
    });
  }

  @action loadUser(user, apiKey, isNew) {
    console.log('load user', user);
    this.data   = user;
    this.apiKey = apiKey;
    this.isNew  = isNew;
  }

  @action getFromLocal(){
    if (ENV_TYPE == 'browser') {
      const apiKey = localStorage.getItem('apiKey');
      const user   = JSON.parse(localStorage.getItem('user'));
      if (!!apiKey && !!user) {
        this.apiKey = apiKey;
        this.data   = user;
      }
    }
  }

  @action getFromServer(){
    if (!this.data.id) return;
    fetch.get(urlJoin(config.api.url, 'user/'+this.data.id+'/'))
    .then(res => runInAction(() => this.data = res.body))
  }

  @action setLocale(loc) {
    if (loc != this.locale) {
      setLanguageFile(loc);
      if (this.data.id) this.data.language = loc;
      this.locale = loc;
    }
  }

  @action signOut() {
    this.apiKey = '';
    this.data   = {};
  }

  @action setLocation(loc) {
    this.location = loc;
  }

  @action addFollowedTag(tag) {
    if (this.data.followed_tags) {
      this.data.followed_tags.push(tag);
    }
  }

  @action incrementDateoCount() {
    this.data.dateo_count++;
  }

  isEditable = (obj) => {
    return this.isSignedIn && !!obj && !!obj.user && obj.user.id == this.data.id;
  }

  setLastLoggedOutRoute(rState) {
    this.lastLoggedOutRoute = rState;
  }
}
