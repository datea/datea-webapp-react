import {observable, action, computed, autorun, reaction, runInAction, toJS, when} from 'mobx';
import {scaleOrdinal, schemeCategory10} from 'd3';
import _ from 'lodash';
import Api from '../rest-api';
import MapStore from './map';
import config from '../../config';
import {reduceIntoObjById} from '../../utils';
import {chartColors} from '../../config/colors';

const getColor = (i) => {
  i = i % chartColors.length;
  return chartColors[i];
}

const DATEO_QUERY_DEFAULTS = {
  limit: 100
}

export default class Campaign {

  @observable data = {
    campaign : {},
    showDateoDetail : false,
  };

  @observable layoutMode = 'content';

  constructor(main) {
    this.main = main;
    this.map = new MapStore(this.main, 'campaign', this.onMarkerClick);
  }

  @action loadView = (user, slug, showLoading = true) => {
    !!showLoading && this.main.ui.setLoading(true);
    Api.campaign.getList({user, slug})
    .then(res => runInAction(() => {
      if (res.objects.length == 1) {
        this.data.campaign = this.hydrateCampaign(res.objects[0]);
        const {boundary: geometry, center, zoom} = this.data.campaign;
        this.map.createMap({center, zoom, geometry});
        this.main.dateo.getDateos({...DATEO_QUERY_DEFAULTS, tags: this.data.campaign.main_tag.tag})
        .then( res => {
          showLoading && this.main.ui.setLoading(false);
          if (this.main.router.queryParams && this.main.router.queryParams.dateo) {
            this.map.navigateToDateo(this.main.router.queryParams.dateo)
          }
        })
      }else{
        this.main.ui.show404();
      }
    }))
    .catch((err) => console.log(err));
  }

  hydrateCampaign = (campaign) => {

    // settings
    campaign.settings = !!campaign.settings ? JSON.parse(campaign.settings) : null;

    // subtags
    let subtagArray;
    if (campaign.settings && campaign.settings.subtags) {
      subtagArray = campaign.secondary_tags.map(tag => {
        return {
          tag : tag.tag,
          order : campaign.settings.subtags[tag.tag].order,
          color : campaign.settings.subtags[tag.tag].color
        }
      })
    } else {
      subtagArray = campaign.secondary_tags.map( (tag, i) => {
        return {
          tag: tag.tag,
          order : i,
          color: getColor(i)
        }
      })
    }

    subtagArray =  _.sortBy(subtagArray, 'order');
    let subtags = new Map();
    subtagArray.forEach(tag => subtags.set(tag.tag, tag));

    campaign.subtags = subtags;
    return campaign;
  }

  onMarkerClick = (id, latLng) => {
    this.main.openDateo({dateo: id});
  }

  @action onOpenDateo = (id) => {
    this.map.navigateToDateo(id);
    this.main.dateo.getDateoDetail(id);
    this.showDateoDetail = true;
  }

  @action setLayout = (layout) => {
    this.layoutMode = layout;
  }

  dispose = () => {
    this.map.dispose();
    this.main.dateo.clearDateos();
    this.data.campaign = null;
  }
}
