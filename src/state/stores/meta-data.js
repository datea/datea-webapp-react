import {observable, action, autorun, reaction, runInAction, toJS, when} from 'mobx';
import urlJoin from 'url-join';
import {getImgSrc} from '../../utils';
import {t} from '../../i18n';
import config from '../../config';
import defaultImage from '../../img/logo-large.png';

const defaultData = {
  title : {id : 'METADATA.DEFAULT.TITLE'},
  description: {id: 'METADATA.DEFAULT.DESCRIPTION'},
  imgUrl : urlJoin(config.app.url, defaultImage)
};

export default class MetaDataStore {

  @observable title = t(defaultData.title.id);
  @observable description = t(defaultData.description.id);
  @observable imgUrl = defaultData.imgUrl;
  @observable url = defaultData.url;

  currentData = {};

  constructor(main) {
    this.main = main;
    this.langReaction = reaction(
      () => this.main.user.locale,
      locale => {
        this.set();
      }
    )
  }

  @action set(data = {}) {
    if (data) {
      this.currentData = data;
    } else {
      data = this.currentData;
    }

    // add lang to link
    let url = data.url ? urlJoin(config.app.url, data.url) : urlJoin(config.app.url, this.main.router.currentPath);
    if (url.indexOf('lang=') == -1) {
      url = url + (url.indexOf('?') != -1 ? '&' : '?')+'lang='+this.main.user.locale;
    }
    let title = (!!data.title ? t(data.title.id, data.title.params ) : t(defaultData.title.id));
    this.title = title + t('METADATA.TITLE_SUFFIX');
    this.description = !!data.description ? t(data.description.id, data.description.params) : t(defaultData.description.id);
    this.imgUrl = data.imgUrl ? getImgSrc(data.imgUrl) : defaultData.imgUrl;
    this.url = url;

    this.main.setServerSideReady();
  }
}
