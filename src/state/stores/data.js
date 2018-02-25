import {observable, action, computed, autorun, reaction, runInAction, toJS} from 'mobx';
import {scaleOrdinal, schemeCategory10} from 'd3';
import config from '../../config';
import {fetch} from '../../utils';
import urlJoin from 'url-join';

const DATEO_QUERY_DEFAULTS = {
  limit: 1000
}

const colors = scaleOrdinal(schemeCategory10);
const getColor = i => colors(i%10);

export default class DataStore {

    @observable search = '';

    @observable mappingQueryParams = {};
    @observable dateoQueryParams = {};

    @observable dateos = new Map();
    @observable mappings = new Map();

    @observable detail = {
      dateo: null,
      mapping: null
    };

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

    @action getMappingDetail(id, type='campaign', opts = {forceUpdate: true, showLoading: true}) {
      const url = urlJoin(config.api.url, type, id);
      !!opts.showLoading && this.main.ui.setLoading(true);
      this.getReq(url)
      .then(res => runInAction(() => {
        opts.showLoading && this.main.ui.setLoading(false);
        this.detail.mapping = this.hydrateMapping(res);
      }))
      .catch((err) => console.log(err));
    }

    @action getCampaignDetailByUserAndSlug = (user, slug, opts = {forceUpdate: true, showLoading: true}) => {
      const url = urlJoin(config.api.url, 'campaign');
      !!opts.showLoading && this.main.ui.setLoading(true);
      this.getReq(url, {user, slug})
      .then(res => runInAction(() => {
        opts.showLoading && this.main.ui.setLoading(false);
        if (res.objects.length == 1) {
          this.detail.mapping = this.hydrateMapping(res.objects[0]);
          console.log(res.objects[0]);
          this.setDateoQuery({tags: this.detail.mapping.main_tag.tag});
        }else{
          this.main.ui.show404();
        }
      }))
      .catch((err) => console.log(err));
    }

    hydrateMapping = (mapping) => {
      if (mapping && mapping.secondary_tags) {
        mapping.subTags = mapping.secondary_tags.reduce((result, item, i) => {
          result[item.tag] = Object.assign({}, item, {color: getColor(i)});
          return result;
        }, {});
      }
      return mapping;
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
        this.detail.dateo = this.dateos.get(id);
      } else {
        !!opts.showLoading && this.main.ui.setLoading(true);
        const url = urlJoin(config.api.url, 'dateo', id);
        this.getReq(url)
        .then(res => runInAction(() => {
          opts.showLoading && this.main.ui.setLoading(false);
          this.detail.dateo = res;
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
