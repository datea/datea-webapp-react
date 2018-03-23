import {observable, action, extendObservable, toJS} from 'mobx';
import Api from '../rest-api';
import moment from 'moment';
import MapInputStore from './map-input';
import {reduceIntoObjById} from '../../utils';
import {t} from '../../i18n';


export default class DateoFormStore {

  @observable dateo = new Map();
  @observable errors = new Map();
  @observable layoutMode = 'content';

  constructor(main, id) {
    this.main = main;
    this.map = new MapInputStore(this.main, {
      geometryType: 'Point',
      onMarkerPlacedByuser : this.processReverseGeocodeResult
    });
    if (id && id != 'new') {
      let dateo = this.main.dateo.data.dateos.get(String(id));
      if (dateo) {
        this.map.createMap({geometry:  obj.position || obj.geometry_collection});
      } else {
        Api.dateo.getDetail(id)
        .then(obj => {
          this.dateo.merge(obj);
          this.map.createMap({geometry: obj.position || obj.geometry_collection});
        })
        .catch((e) => {
          console.log('que hacer si el dateo no existe?');
        })
      }
    } else {
      this.map.createMap({});
    }
  }

  /* SETTERS */

  @action setContent = (value) => {
    this.dateo.set('content', value);
    if (value) {
      this.errors.delete('content')
    }
  }

  @action setTitle = (value) => {
    this.dateo.set('title', value);
  }

  @action setTags = (tags) => {
    this.dateo.set('tags', tags);
    if (tags.length) {
      this.errors.delete('tags')
    }
  }

  @action setDate = (date) => {
    this.dateo.set('date', moment(date).toISOString());
  }

  getDateField = () => {
    const date = this.dateo.get('date');
    if (date) {
      return moment(date);
    }else {
      return null;
    }
  }

  /* IMAGES AND FILES */
  @action addMedia = (resource) => {
    const field = resource.image ? 'images' : 'files';
    let list = this.dateo.get(field) || [];
    const order = list.length;
    list.push(resource);
    if (resource.order != order) {
      resource.order = order;
      Api[field.slice(0,-1)].patch(resource);
    }
    this.dateo.set(field, list);
  }

  @action resortMedia = (resourceList) => {
    if (resourceList.length) {
      const field = resourceList[0].image ? 'images' : 'files';
      resourceList = resourceList.map((res, i) => {
        res.order = i;
        Api[field.slice(0, -1)].patch(res);
        return res;
      });
      this.dateo.set(field, resourceList);
    }
  }

  @action deleteMedia = (resource) => {
    const field = resource.image ? 'images' : 'files';
    Api[field.slice(0,-1)].delete(resource);
    const list = this.dateo.get(field).filter(i => i.id != resource.id);
    this.dateo.set(field, list);
  }

  @action mediaEdited = (resource) => {
    const field = resource.image ? 'images' : 'files';
    Api[field.slice(0,-1)].patch(resource);
    const list = this.dateo.get(field)
    const idx = list.findIndex(r => r.id == resource.id);
    list[idx] = resource;
    this.dateo.set(field, list);
  }

  @action receiveGeocodeResult = place => {
    if (this.map.getType() == 'Point') {
      if (place.geometry) {
        //this.map.setMarker(place.geometry.location);
        //this.map.lmap.fitBounds(place.geometry.bounds);
      }
      this.dateo.set('address', place.formatted_address);
    }
  }

  /* SAVE */
  @action save = () => {
    let data = toJS(this.dateo);
    const geometry = this.map.getGeometry();
    if (!geometry) {
      !!data.position && delete data.position;
      !!data.geometry_collection && delete data.geometry_collection;
    } else if (geometry.type == 'Point' && geometry.coordinates) {
      data.position = geometry;
    } else if (geometry.type == 'GeometryCollection') {
      data.geometry_collection = geometry;
    }

    // validation
    if (!this.validate()) return;

    this.main.ui.setLoading(true);
    Api.dateo.save(data)
    .then(dateo => {
      this.main.openDateo({dateo, isNew: !data.id});
    }).catch(e => {
      this.main.ui.setLoading(false);
      this.errors.set('main', t('DATEAR.ERROR.UNKNOWN'))
    });
  }

  @action validate = () => {
    this.errors.clear();
    // needs content
    if (!this.dateo.get('content') || !this.dateo.get('content').trim()) {
      this.errors.set('content', t('DATEAR.ERROR.NO_CONTENT'))
    }
    // at least 1 tag
    if (!this.dateo.get('tags') || !this.dateo.get('tags').length) {
      this.errors.set('tags', t('DATEAR.ERROR.NO_TAG'))
    }
    return !this.errors.size
  }

  @action setLayout = mode => {
    this.layoutMode = mode;
    if (mode == 'content') {
      setTimeout(() => this.map.setViewOnGeometry(), 350);
    }
  }

  processReverseGeocodeResult = (result) => {
    this.dateo.set('address', result.formatted_address);
  }


  @action dispose = () => {
    //dispose here anything
  }
}
