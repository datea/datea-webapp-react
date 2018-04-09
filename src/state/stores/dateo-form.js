import {observable, action, extendObservable, toJS} from 'mobx';
import Api from '../rest-api';
import moment from 'moment';
import MapInputStore from './map/input-map';
import {reduceIntoObjById} from '../../utils';
import {t} from '../../i18n';


export default class DateoFormStore {

  @observable dateo = new Map();
  @observable errors = new Map();
  @observable suggestedTags = [];
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
        this.dateo.merge(dateo);
        this.map.createMap({geometry:  toJS(dateo.position || dateo.geometry_collection)});
      } else {
        Api.dateo.getDetail(id)
        .then(obj => {
          this.dateo.merge(obj);
          this.map.createMap({geometry: toJS(obj.position || obj.geometry_collection)});
        })
        .catch((e) => {
          console.log('que hacer si el dateo no existe?');
        })
      }
    } else {
      setTimeout( () => {
        this.map.createMap({});
      }, 100);
    }
    this.buildTagSuggestions();
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
        this.map.setMarker(place.geometry.location);
        this.map.lmap.fitBounds(place.geometry.bounds);
      }
      this.dateo.set('address', place.formatted_address);
    }
  }

  @action buildTagSuggestions = () => {
    //get context first
    const context = this.main.getDatearContext();
    if (!context) return;

    let tags = [];
    if (context.type == 'user') {
      if (context.data.tags_followed) {
        tags = tags.concat(context.data.tags_followed.map(t => t.tag));
      }
    } else if (context.type == 'campaign') {
      if (context.data.subtags) {
        tags = tags.concat(context.data.subtags.values().map(t => t.tag));
      }
    }
    this.suggestedTags.replace(tags);
  }

  dehydrate = () => {

    let data = toJS(this.dateo);

    // geometry
    const geometry = this.map.getGeometry();
    if (!geometry) {
      !!data.position && delete data.position;
      !!data.geometry_collection && delete data.geometry_collection;
    } else if (geometry.type == 'Point' && geometry.coordinates) {
      data.position = geometry;
      if (data.geometry_collection) {
        delete data.geometry_collection;
      }
    } else if (geometry.type == 'GeometryCollection') {
      if (data.position) {
        delete data.position;
      }
      data.geometry_collection = geometry;
    }

    // add
    const context = this.main.getDatearContext();
    if (context && context.type == 'campaign') {
      // add main tag to tags
      if (data.tags) {
        data.tags.unshift(context.data.main_tag.tag);
      } else {
        data.tags = [context.data.main_tag.tag];
      }
      // add campaign id
      data.campaign = context.data.id;
    }
    return data;
  }

  /* SAVE */
  @action save = () => {
    // validation
    if (!this.validate()) return;
    const data = this.dehydrate();

    this.main.ui.setLoading(true);
    Api.dateo.save(data)
    .then(model => {
      model.isNew = !data.id;
      this.main.dateo.data.dateos.set(String(model.id), model);
      this.main.openDateo({dateo: model, isNew: !data.id});
      if (model.isNew) {
        this.main.user.data.dateo_count++;
      }
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
      this.map.hidePMControls();
      setTimeout(() => this.map.setViewOnGeometry(), 350);
    } else {
      this.map.showPMControls();
    }
  }

  processReverseGeocodeResult = (result) => {
    this.dateo.set('address', result.formatted_address);
  }


  @action dispose = () => {
    //dispose here anything
    this.map.dispose();
  }
}
