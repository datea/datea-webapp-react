import {observable, action, autorun, reaction, runInAction, toJS, when} from 'mobx';
import {routerStateToUrl} from 'mobx-state-router';
import urlJoin from 'url-join';
import {getImgSrc} from '../../utils';
import {t} from '../../i18n';
import config from '../../config';

const defaultData = {
  title : {id : 'METADATA.DEFAULT.TITLE'},
  description: {id: 'METADATA.DEFAULT.DESCRIPTION'},
  imgUrl : urlJoin(config.app.url, 'img/logo-large-whitebg.png'),
};

export default class MetaDataStore {

  @observable title = t(defaultData.title.id);
  @observable description = t(defaultData.description.id);
  @observable imgUrl = defaultData.imgUrl;
  @observable url = '';
  @observable hashtags = [];

  currentData = {};

  constructor(main) {
    this.main = main;
    this.langReaction = reaction(
      () => this.main.user.locale,
      locale => {
        this.set();
      }
    )
    console.log(defaultData.imgUrl);
  }

  @action set(data = {}) {
    if (data) {
      this.currentData = data;
    } else {
      data = this.currentData;
    }

    const rState = this.main.router.routerState;
    if (!data.url && (!rState.routeName || rState.routeName == '__initial__')) return;

    // add lang to link
    let url = data.url ? urlJoin(config.app.url, data.url) : urlJoin(config.app.url, routerStateToUrl(this.main.router, rState));
    if (url.indexOf('lang=') == -1) {
      url = url + (url.indexOf('?') != -1 ? '&' : '?')+'lang='+this.main.user.locale;
    }
    let title = (!!data.title ? t(data.title.id, data.title.params ) : t(defaultData.title.id));
    this.title = t('METADATA.TITLE_PREFIX') + ' ' + title;
    this.description = !!data.description ? t(data.description.id, data.description.params) : t(defaultData.description.id);
    this.imgUrl = data.imgUrl ? getImgSrc(data.imgUrl) : defaultData.imgUrl;
    console.log('this.imgUrl', this.imgUrl);
    this.url = url;

    if (data.hashtags && data.hashtags.length) {
      this.hashtags.replace(data.hashtags)
    } else {
      this.hashtags.clear();
    }

    this.main.setServerSideReady();
  }
}
