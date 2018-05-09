import {observable, action, computed, autorun, reaction, runInAction, toJS, when} from 'mobx';
import urlJoin from 'url-join';
import Api from '../rest-api';
import config from '../../config';

export default class HomeView {

  @observable mappings = [];
  @observable mappingsFollowed = [];
  @observable limit = 20;
  @observable numResults = 0;
  maxLoad = 60;

  constructor(main) {
    this.main = main;
    this.initLoadMappings();
  }

  @action initLoadMappings = () => {
    this.main.ui.setLoading(true);
    Promise.all([
      Api.mapping.getList({followed_by_tags: this.main.user.data.id})
      .then(res => runInAction(() => {
        this.mappingsFollowed.replace(res.objects);
      })),
      Api.mapping.getList({limit: this.limit})
      .then(res => runInAction(() => {
        this.numResults = res.meta.total_count;
        this.mappings.replace(res.objects);
      }))
    ]).finally(() => this.main.ui.setLoading(false));
  }

  @action loadMore = () => {
    if (this.limit < this.maxLoad && this.limit < this.numResults) {
      this.limit += 20;
      const params = {
        limit : this.limit,
        offset : this.limit - 20
      }
      Api.mapping.getList(params)
      .then(res => runInAction(() => {
        this.mappings.replace(res.objects);
      }));
    }
  }
}
