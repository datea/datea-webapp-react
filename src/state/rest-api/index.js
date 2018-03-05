import config from '../../config';
import {fetch} from '../../utils';
import urlJoin from 'url-join';

const url = (...pathElems) => urlJoin(config.api.url, ...pathElems.map(p => String(p)));

class Api {

  /* MAPPINGS */
  // to get campaigns for a user: params.followed_by_tags = USER.data.id
  mapping = {
    getList : (params = {}) => this.get(url('mapping'), params)
  };

  /* CAMPAIGNS */
  campaign = {
    getList : (params = {}) => this.get(url('campaign'), params),
    getDetail : id => this.get(url('campaign', id)),
    post : obj => this.post(url('campaign'), obj),
    patch : obj => this.patch(url('campaign', obj.id), obj),
    delete : obj => this.delete(url('campaign', obj.id))
  };

  /* DATEOS */
  dateo = {
    getList : (params = {}) => this.get(url('dateo'), params),
    getDetail : id => this.get(url('dateo', id)),
    post : obj => this.post(url('dateo'), obj),
    patch : obj => this.patch(url('dateo', obj.id), obj),
    delete : obj => this.delete(url('dateo', obj.id))
  };

  /* IMAGES */
  image = {
    getDetail : id => this.get(url('image'), id),
    patch : obj => this.patch(url('image', obj.id), obj),
    delete : obj => this.delete(url('image', obj.id))
  };

  /* URL INFO */
  urlInfo = {
    get : (url) => this.get(url('url_info'), {url})
  }

  /* BASIC NETWORKING */
  get = (url, params = {}) => new Promise((resolve, reject) => {
    fetch.get(url, params)
    .then(res => resolve(res.body))
    .catch(err => reject(err))
  });

  post = (url, params = {}) => new Promise((resolve, reject) => {
    fetch.post(url, params)
    .then(res => resolve(res.body))
    .catch(err => reject(err))
  });

  put = (url, params = {}) => new Promise((resolve, reject) => {
    fetch.put(url, params)
    .then(res => resolve(res.body))
    .catch(err => reject(err))
  });

  patch = (url, params = {}) => new Promise((resolve, reject) => {
    fetch.patch(url, params)
    .then(res => resolve(res.body))
    .catch(err => reject(err))
  });

  delete = (url, params = {}) => new Promise((resolve, reject) => {
    fetch.delete(url, params)
    .then(res => resolve(res.body))
    .catch(err => reject(err))
  });
}

export default new Api();
