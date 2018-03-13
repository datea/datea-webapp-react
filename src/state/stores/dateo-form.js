import {observable, action, extendObservable} from 'mobx';
import Api from '../rest-api';
import moment from 'moment';
import MapInputStore from './map-input';
import {reduceIntoObjById} from '../../utils';


export default class DateoFormStore {

  @observable dateo = new Map();
  @observable errors = new Map();
  @observable layoutMode = 'content';

  constructor(main, id) {
    this.main = main;
    this.map = new MapInputStore(this.main, {
      mode: 'dateo',
      onMarkerPlacedByuser : this.processReverseGeocodeResult
    });
    if (id) {
      console.log(id);
    }
  }

  /* SETTERS */

  @action setContent = (value) => {
    this.dateo.set('content', value);
  }

  @action setTitle = (value) => {
    this.dateo.set('title', value);
  }

  @action setTags = (tags) => {
    this.dateo.set('tags', tags);
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
    if (this.map.mapState.mode == 'point') {
      if (place.geometry) {
        this.map.setMarker(place.geometry.location);
        this.map.lmap.fitBounds(place.geometry.bounds);
      }
      this.dateo.set('address', place.formatted_address);
    }
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
