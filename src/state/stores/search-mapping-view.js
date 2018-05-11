import {observable, action, computed, autorun, reaction, runInAction, toJS, when} from 'mobx';
import urlJoin from 'url-join';
import Api from '../rest-api';
import config from '../../config';


export default class SearchMappingView {

  @observable mappings = [];
  @observable numResults = 0;
  @observable limit = 20;

  constructor(main) {
    this.main = main;
    this.initQueryReaction();
  }

  getSearchParams = () => {
    if (this.main && this.main.router.queryParams) {
      const {dateo, datear, slideshow, lang, ...params} = this.main.router.queryParams;
      return params;
    } else {
      return {};
    }
  }

  initQueryReaction = () => {
    this.disposeQueryreaction = reaction(
      () => this.main.router && this.main.router.queryParams && this.getSearchParams(),
      (searchParams) => this.loadMappings(searchParams),
      {fireImmediately: true}
    );
  }

  @action loadMore = () => {
    this.limit += 20;
    this.loadMappings(this.getSearchParams(), false);
  }

  @action loadMappings = (searchParams, showLoading = true) => {
    searchParams.limit = this.limit;
    searchParams.offset = this.limit - 20;
    showLoading && this.main.ui.setLoading(true);
    Api.mapping.getList(searchParams)
    .then(res => runInAction(() => {
      this.numResults = res.meta.total_count;
      this.mappings.replace(res.objects);
    }))
    .finally(() => showLoading && this.main.ui.setLoading(false))
  }

  dispose() {
    this.disposeQueryreaction();
  }
}
