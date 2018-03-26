import {observable, action, computed, autorun, reaction, runInAction, toJS, when} from 'mobx';
import {scaleOrdinal, schemeCategory10} from 'd3';
import {StripChar} from 'stripchar';
import _ from 'lodash';
import debounce from 'debounce-promise';
import Api from '../rest-api';
import MapInputStore from './map/input-map';
import config from '../../config';
import {chartColors} from '../../config/colors';
import {t} from '../../i18n';

const defaultValues = {
  published : true,
  main_tag : {}
};

const formConfig = {
    mainTagMinLength : 2
};

export default class CampaignFormStore {

  @observable campaign = new Map();
  @observable options = new Map();
  @observable errors = new Map();

  constructor(main, id) {
    this.main = main;

    this.map = new MapInputStore(this.main, {
      geometryType: 'Polygon'
    });

    if (id && id != 'new') {
      this.main.ui.setLoading(true);
      Api.campaign.getDetail(id)
      .then(obj => {
        this.main.ui.setLoading(false);

        if (obj.user.id != this.main.user.data.id) {
          console.log('unauthorized');
        }

        if (obj.category && obj.category.id) {
          obj.category = obj.category.id;
        }
        this.campaign.merge(obj);
        this.hydrate(obj);
        const {boundary: geometry, center, zoom} = obj;
        this.map.createMap({center, zoom, geometry});
      })
      .catch(() => {
        this.main.ui.setLoading(false);
        this.main.ui.show404()
      });
    } else {
      this.campaign.merge(defaultValues);
      this.map.createMap({});
    }
    this.getCategories();
  }

  @action setField = (fieldName, value) => {
    !!this.errors.get(fieldName) && this.errors.delete(fieldName);
    this.campaign.set(fieldName, value);
  }

  @action setCheckbox = (fieldName, checked, value) => {
    if (checked) {
      this.campaign.set(fieldName, value);
    } else {
      this.campaign.delete(fieldName);
    }
  }

  getMainTag = () => {
    return this.campaign.get('main_tag') ? (this.campaign.get('main_tag').tag || '') : '';
  }

  setMainTag = (tag) => {
    tag = StripChar.RSspecChar(tag) || '';
    tag = tag.replace(/ /g, '');
    this.campaign.set('main_tag', {...this.campaign.get('tag'), ...{tag}});
    if (tag.length > formConfig.mainTagMinLength) {
      this.checkMainTagExists(tag);
    }
  }

  setImage = (field, resource) => {
    this.campaign.set(field, resource);
  }

  getImage = (field) => {
    const img = this.campaign.get(field);
    return img ? img.image : '';
  }

  hydrate = (model) => {
    let subtags;

    // settings
    if (model.settings) {
      const parsed = JSON.parse(model.settings);
      model.settings = parsed;
      this.campaign.set('settings', parsed);
    }

    //subtags
    if (model.settings && model.settings.subtags) {
      subtags = model.secondary_tags.map(tag => {
        return Object.assign({}, tag, model.settings.subtags[tag.tag]);
      });
    } else {
      subtags = model.secondary_tags.map((tag, i) => {
        return Object.assign({}, tag, {order: i, color: chartColors[i]})
      })
    }
    subtags = _.sortBy(subtags, 'order');
    this.campaign.set('subtags', subtags);
  }

  dehydrate = () => {
    let model = toJS(this.campaign);
    if (model.subtags) {
      delete model.subtags;
    }
    // secondary tags and subtag settings
    let secondaryTags = [], subtagSettings = {};
    (this.campaign.get('subtags') || []).forEach( tag => {
      subtagSettings[tag.tag] = {color: tag.color, order: tag.order};
      secondaryTags.push(_.omit(tag, ['color', 'order']))
    })
    model.secondary_tags = secondaryTags;
    let settings = this.campaign.get('settings') || {};
    settings.subtags = subtagSettings;
    model.settings = JSON.stringify(settings);

    // position and boundary (if any);
    Object.assign(model, this.map.getCenterAndZoom());
    model.boundary = this.map.getGeometry();

    return model;
  }

  _checkMainTagExists = (tag) => new Promise((resolve, reject) => {
      Api.campaign.getList({main_tag: tag})
      .then( res => {
        if (res.objects && res.objects.length) {
          if (!this.campaign.get('id') || res.objects.length > 1) {
            this.errors.set('main_tag', t('CAMPAIGN_FORM.DUPLICATE_MAINTAG'));
            resolve(true);
          } else {
            if (this.campaign.get('id') != res.objects[0].id) {
              this.errors.set('main_tag', t('CAMPAIGN_FORM.DUPLICATE_MAINTAG'));
              resolve(true);
            } else {
              this.errors.delete('main_tag');
              resolve(false);
            }
          }
        } else {
          this.errors.delete('main_tag');
          resolve(false);
        }
      })
      .catch(() => {
        this.errors.delete('main_tag');
        resolve(false);
      });
  })

  getCategories = () => {
    Api.category.getList()
    .then( res => {
      if (res.objects) {
        this.options.set('categories', res.objects);
      }
    })
  }

  @action save = () => {
      if (!this.validate()) return;

      this.main.ui.setLoading(true);
      const campaign = this.dehydrate();

      Api.campaign.save(campaign)
      .then((res) => {
        this.main.goTo('campaign', {
          username: res.user.username,
          slug : res.slug
        });
      })
      .catch(e => {
        this.main.ui.setLoading(false);
        this.errors.set('main', t('ERROR.UNKNOWN'));
      })
  }

  @action validate = () => {
    if (this.errors.get('main_tag')) {
      return false;
    }
    this.errors.clear();
    // required txt or number fields
    ['name',
     'short_description',
     'mission',
     'category',
     'information_destiny',
     'information_destiny',
    ].forEach( field => {
     let f = this.campaign.get(field);
     if (typeof(f) == 'string') {
       f = f.trim();
     }
     !f && this.errors.set(field, t('ERROR.REQUIRED_FIELD'));
    })


    if (!this.campaign.get('main_tag') || !this.campaign.get('main_tag').tag) {
      this.errors.set('main_tag', t('ERROR.REQUIRED_FIELD'));
    }
    !!this.errors.size && this.errors.set('main', t('ERROR.GENERAL_REQUIRED_FIELDS'));
    return !this.errors.size;
  }

  checkMainTagExists = debounce(this._checkMainTagExists, 800);
}
