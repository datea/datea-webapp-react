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


  /* IMAGES */
  @action addImage = (imgRes) => {
    let images = this.dateo.get('images') || [];
    const order = images.length;
    images.push(imgRes);
    if (imgRes.order != order) {
      imgRes.order = order;
      Api.image.patch(imgRes);
    }
    this.dateo.set('images', images);
  }

  @action resortImages = (imgResources) => {
    imgResources = imgResources.map((imgRes, i) => {
      imgRes.order = i;
      Api.image.patch(imgRes);
      return imgRes;
    });
    this.dateo.set('images', imgResources);
  }

  @action deleteImage = (imgResource) => {
    Api.image.delete(imgResource);
    const images = this.dateo.get('images').filter(i => i.id != imgResource.id);
    this.dateo.set('images', images);
  }

  @action dispose = () => {
    //dispose here anything
  }
}
