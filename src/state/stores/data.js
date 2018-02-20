import {observable, action, computed, autorun, reaction, runInAction, toJS} from 'mobx';
import config from '../../config';
import {fetch} from '../../utils';
import urlJoin from 'url-join';

const DATEO_QUERY_DEFAULTS = {
  limit: 1000
}

export default class DataStore {

    @observable search = '';

    @observable mappingQueryParams = {};
    @observable dateoQueryParams = {};

    @observable dateos = new Map();
    @observable mappings = new Map();

    @observable dateoDetail = null;
    @observable mappingDetail = null;

    constructor(main) {
      this.main = main;
    }

    /* SEARCH */

    @action searchAutoComplete(query) {
      return new Promise((resolve, reject) => {
    		const url = urlJoin(config.api.url, 'mapping/autocomplete');
        fetch.get(url, {q: query})
        .then(result => resolve(result.body))
        .catch(err => reject(err));
    	});
    }

    /* MAPPINGS */

    @action setMappingQuery(params = {}, showLoading = true) {
      this.mappingQueryParams = {showLoading, ...params};
    }

    /* to get campaigns for a user:
       params.followed_by_tags = USER.data.id */
    @action getMappings(params = {}) {
      const {showLoading, ...queryParams} = params;
      !!showLoading && this.main.ui.setLoading(true);
      const url = urlJoin(config.api.url, 'mapping');
      this.getReq(url, queryParams)
      .then(res => runInAction(() => {
        !!showLoading && this.main.ui.setLoading(false);
        this.mappings.replace(this.reduceIntoObjById(res.objects));
      }))
      .catch((err) => console.log(err));
    }

    @action getMappingDetail(id, opts = {forceUpdate: true, showLoading: true}) {
      if (!opts.forceUpdate && this.mappings.has(id)) {
        this.mappingDetail = this.mappings.get(id);
      } else {
        const url = urlJoin(config.api.url, 'mapping', id);
        !!opts.showLoading && this.main.ui.setLoading(false);
        this.getReq(url)
        .then(res => runInAction(() => {
          opts.showLoading && this.main.ui.setLoading(false);
          this.mappingDetail = res;
        }))
        .catch((err) => console.log(err));
      }
    }

    /* DATEOS */

    @action setDateoQuery(params = {}, showLoading = true) {
      params = {...DATEO_QUERY_DEFAULTS, ...params, showLoading};
      this.dateoQueryParams = params;
    }

    @action getDateos(params = {}) {
      const {showLoading, ...queryParams} = params;
      !!showLoading && this.main.ui.setLoading(true);
      const url = urlJoin(config.api.url, 'dateo');
      this.getReq(url, queryParams)
      .then(res => runInAction(() => {
        !!showLoading && this.main.ui.setLoading(false);
        this.dateos.replace(this.reduceIntoObjById(res.objects));
      }))
      .catch((err) => console.log(err));
    }

    @action getDateoDetail(id, opts = {forceUpdate: true, showLoading: true}) {
      if (!opts.forceUpdate && this.dateos.has(id)) {
        this.dateoDetail = this.dateos.get(id);
      } else {
        !!opts.showLoading && this.main.ui.setLoading(true);
        const url = urlJoin(config.api.url, 'dateo', id);
        this.getReq(url)
        .then(res => runInAction(() => {
          opts.showLoading && this.main.ui.setLoading(false);
          this.dateoDetail = res;
        }))
        .catch((err) => console.log(err));
      }
    }

    /* ERRORS */

    @action setLoadingError(e) {
      this.error = e;
    }

    /* REACTIONS / COMPUTED / AUTORUN */

    mappingQueryReaction = reaction(
      () => this.mappingQueryParams,
      (params, reaction) => this.getMappings(params)
    );

    dateoQueryReaction = reaction(
      () => this.dateoQueryParams,
      (params, reaction) => this.getDateos(params)
    );

    /******************************
      NETWORKING
    ********************************/

    getReq = (url, params = {}) => new Promise((resolve, reject) => {
      fetch.get(url, params)
      .then(res => resolve(res.body))
      .catch(err => reject(err))
    });

    // URL VIEW -> get URL meta data
    getURLMeta(params = {}) {
      const url = urlJoin(config.api.url, 'url_info');
      return this.getReq(url, params);
    }

    /* HELPERS */
    reduceIntoObjById = (array) => {
      return array.reduce((result, item) => {
        result[item.id] = item;
        return result;
      }, {});
    }
}
