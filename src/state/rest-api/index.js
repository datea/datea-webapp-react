import config from '../../config';
import {fetch} from '../../utils';
import Geocoder from 'google-geocoder';
import request from 'superagent';
import urlJoin from 'url-join';

const url = (...pathElems) => urlJoin(config.api.url, ...pathElems.map(p => String(p)));

class Api {

  /* MAPPINGS */
  // to get campaigns for a user: params.followed_by_tags = USER.data.id
  mapping = {
    getList : (params = {}) => this.get(url('mapping'), params)
  };

  /* USER */
  user = {
    getList : (params = {}) => this.get(url('user'), params),
    getDetail : id => this.get(url('user', id))
  }

  /* CAMPAIGNS */
  campaign = {
    getList : (params = {}) => this.get(url('campaign'), params),
    getDetail : id => this.get(url('campaign', id)),
    post : obj => this.post(url('campaign'), obj),
    patch : obj => this.patch(url('campaign', obj.id), obj),
    delete : obj => this.delete(url('campaign', obj.id)),
    save : obj => obj.id ? this.campaign.patch(obj) : this.campaign.post(obj)
  };

  /* DATEOS */
  dateo = {
    getList : (params = {}) => this.get(url('dateo'), params),
    getDetail : id => this.get(url('dateo', id)),
    post : obj => this.post(url('dateo'), obj),
    patch : obj => this.patch(url('dateo', obj.id), obj),
    delete : obj => this.delete(url('dateo', obj.id)),
    save : obj => obj.id ? this.dateo.patch(obj) : this.dateo.post(obj)
  };

  /* IMAGES */
  image = {
    getDetail : id => this.get(url('image'), id),
    patch : obj => this.patch(url('image', obj.id), obj),
    delete : obj => this.delete(url('image', obj.id))
  };

  /* FILES */
  file = {
    getDetail : id => this.get(url('file'), id),
    patch : obj => this.patch(url('file', obj.id), obj),
    delete : obj => this.delete(url('file', obj.id))
  };

  /* TAGS */
  tag = {
    getList : (params = {}) => this.get(url('tag'), params),
    getDetail : id => this.get(url('tag'), id),
    post : obj => this.post(url('tag'), obj),
    autocomplete : search => this.get(url('tag/autocomplete'), {q : search})
  };

  category = {
    getList : () => this.get(url('category'))
  };

  /* URL INFO */
  urlInfo = {
    get : (url) => this.get(url('url_info'), {url})
  };

  /* GOOGLE PLACES */
  autocompletePlace = (query, latLng, radius = 50000) => {
    if (query && query.trim().length > 2) {
      const params = {
        input : query,
      }
      if (latLng) {
        params.location = latLng.lat+','+latLng.lng;
        params.radius = radius
      }
      return this.get(url('geocoding', 'autocomplete'), params)
    }else{
      return Promise.resolve({'result': []});
    }
  };

  placeDetail = (placeid) => this.get(url('geocoding', 'placedetail'), {placeid});

  /* GEOCODE */
  geocode = (query) => new Promise((resolve, reject) => {
    /*const url = 'https://nominatim.openstreetmap.org/search/'+encodeURIComponent(query);
    return this.get(url, {format: 'json', addressdetails: 1});*/
    Geocoder({key: config.keys.google})
    .find(query, (err, res) => {
      if (err) {
        reject(err)
      }else {
        resolve(res);
      }
    });
  });

  /* REVERSE GEOCODE */
  /*revGeocode = ({lat, lng, zoom = 17}) =>
    const url = 'https://nominatim.openstreetmap.org/reverse';
    return this.get(url, {lat, lon: lng, zoom, addressdetails: 1, namedetails: 1});
  };*/
  reverseGeocode = (latLng) => new Promise((resolve, reject) => {
    Geocoder({key: config.keys.google})
    .reverseFind(latLng.lat, latLng.lng, (err, res) => {
      if (err) {
        reject(err)
      }else {
        resolve(res);
      }
    });
  });

  /* BASIC NETWORKING */
  get = (url, params = {}, options = {}) => new Promise((resolve, reject) => {
    fetch.get(url, params, options)
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
