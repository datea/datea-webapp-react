import {observable, action, computed, autorun, runInAction, toJS} from 'mobx';
import config from '../config';
import {fetch} from '../utils';
import UI from './ui';
import USER from './user';
import urlJoin from 'url-join';

class DataStore {
    @observable search = '';
    @observable mappingFilters = {};
    @observable dateoFilters = {};
    @observable userMappings = [];

    @action searchAutoComplete(query) {
      return new Promise((resolve, reject) => {
    		const url = urlJoin(config.api.url, 'mapping/autocomplete');
        fetch.get(url, {q: query})
        .then(result => resolve(result.body))
        .catch(err => reject(err));
    	});
    }

    @action getUserMappings(params = {}) {
      UI.setLoading(true);
      params.followed_by_tags = USER.data.id;
      this.getMappings(params)
      .then(res => runInAction(() => {
        UI.setLoading(false);
        this.userMappings = res.objects;
      }))
      .catch((err) => console.log(err));
    }


    /******************************
      NETWORKING
    ********************************/

    // MAPPINGS
    getMappings(params = {}) {
      return new Promise((resolve, reject) => {
        const url = urlJoin(config.api.url, 'mapping');
        fetch.get(url, params)
        .then(result => resolve(result.body))
        .catch(err => reject(err));
      })
    }



}

let singleton = new DataStore();
export default singleton;
