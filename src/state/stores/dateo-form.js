import {observable, action, extendObservable} from 'mobx';
import Api from '../rest-api';
import {reduceIntoObjById} from '../../utils';


export default class DateoFormStore {

  @observable dateo = new Map();
  @observable errors = new Map();

  constructor(main, id) {
    this.main = main;
    if (id) {
      console.log(id);
    }
  }

  @action setContent = (value) => {
    this.dateo.set('content', value);
  }


  /* IMAGES AND FILES */
  @action addMedia = (resource) => {
    console.log('resource', resource);
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

  @action dispose = () => {
    //dispose here anything
  }
}
