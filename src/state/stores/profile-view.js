import {observable, action, computed, autorun, reaction, runInAction, toJS, when} from 'mobx';
import urlJoin from 'url-join';
import Api from '../rest-api';
import config from '../../config';


export default class ProfileView {

  @observable data = {
    user : {},
    isOwn : false,
    mappingsCreated : [],
    mappingsFollowed : []
  }

  @computed get image() {
    return this.data.user.image ? urlJoin(config.api.imgUrl, this.data.user.image) : '';
  }
  @computed get largeImage() {
    return this.data.user.image_large ? urlJoin(config.api.imgUrl, this.data.user.image_large) : '';
  }
  @computed get mappings() {
    return this.data.mappingsCreated.concat(this.data.mappingsFollowed);
  }

  constructor(main, username) {
    this.username = username;
    this.main = main;
    this.init();
  }

  @action init() {
    if (this.main.user.isSignedIn && this.main.user.data.username == this.username) {
      this.data.isOwn = true;
      this.data.user = this.main.user.data;
      this.main.ui.setLoading(true);
      this.loadMappings().finally(() => this.main.ui.setLoading(false));
    } else {
      this.data.isOwn = false;
      this.main.ui.setLoading(true);
      Api.user.getDetail(this.username)
      .then(res => {
        this.data.user = res;
        this.setMetaData(res);
        this.loadMappings();
      })
      .catch(e => {
        this.main.ui.show404();
      })
      .finally(() => this.main.ui.setLoading(false));
    }
  }

  @action loadMappings = () => {
    if (!this.data.user.id) return;

    let campaignParams = {user_id: this.data.user.id};
    if (this.data.isOwn) {
      campaignParams.published = 'all';
    }
    let mappingParams = {followed_by_tags: this.data.user.id};

    return Promise.all([
      Api.mapping.getList(campaignParams)
      .then(res => {
        this.data.mappingsFollowed.replace(res.objects);
      }),
      Api.campaign.getList(mappingParams)
      .then(res => {
        this.data.mappingsCreated.replace(res.objects);
      })
    ])
  }

  @action setMetaData = (obj) => {
    this.main.metaData.set({
      title: {id: 'METADATA.PROFILE.TITLE', params : {username: obj.username}},
      description : {id: 'METADATA.PROFILE.TITLE', params: {username : obj.username}},
      imgUrl : obj.image_large
    });
  }
}
