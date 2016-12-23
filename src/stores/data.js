import {observable, action, computed, autorun, runInAction, toJS} from 'mobx';
import config from '../config';
import {fetch} from '../utils';
import UI from './ui';
import urlJoin from 'url-join';

class DataStore {
    @observable search = '';
    @observable mappingFilters = {};
    @observable dateoFilters = {};


    @action searchAutoComplete(query) {
      return new Promise((resolve, reject) => {
    		const url = urlJoin(config.api.url, 'mapping/autocomplete');
        fetch.get(url, {q: query})
        .then(result => resolve(result.body))
        .catch(err => reject(err));
    	});
    }

}

let singleton = new DataStore();
export default singleton;
