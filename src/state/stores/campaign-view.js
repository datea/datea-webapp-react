import {observable, action, computed, autorun, reaction, runInAction, toJS, when} from 'mobx';
import {scaleOrdinal, schemeCategory10} from 'd3';
import _ from 'lodash';
import qs from 'qs';
import Api from '../rest-api';
import MapStore from './map/map';
import config from '../../config';
import {reduceIntoObjById, cleanObject} from '../../utils';
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

  @computed get contentViewMode() {
    return this.data.showDateoDetail ? 'detail-view' : 'list-view';
  }

  @computed get isEditable() {
    const {user} = this.main;
    const {campaign} = this.data;
    return campaign && campaign.user && user && user.data && user.data.id == campaign.user.id;
  }

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
        this.initReactions();
        const {boundary: geometry, center, zoom} = this.data.campaign;
        this.map.createMap({center, zoom, geometry});
      }else{
        this.main.ui.show404();
      }
    }))
    .catch((err) => console.log(err));
  }

  initReactions = () => {
    this.disposeDateoQueryReaction = reaction(
      () => {
        const {datear, dateo, ...params} = this.main.router.queryParams;
        return qs.stringify(params || {});
      },
      () => {
        console.log('query dateos');
        this.queryDateos();
      },
      true
    );

    this.disposeDetailViewReaction = reaction(
      () => {
        const {queryParams} = this.main.router;
        if (queryParams && queryParams.dateo && this.main.dateo.data.dateos.has(String(queryParams.dateo))) {
          return queryParams.dateo;
        }else {
          return false;
        }
      },
      dateoId => {
        !!dateoId && setTimeout(() => this.map.navigateToLayer(dateoId), 50);
        this.data.showDateoDetail = dateoId;
      },
      true
    );
  }

  disposeReactions = () =>  {
    !!this.disposeDateoQueryReaction && this.disposeDateoQueryReaction();
    !!this.disposeDetailViewReaction && this.disposeDetailViewReaction();
  }

  getCurrentDateoQueryParams = () => {
    const {router} = this.main;
    const {datear, dateo, ...params} = !!router.queryParams ? toJS(router.queryParams) : {};
    return params;
  }

  @action setQueryParams = (newParams, replace = true) => {
    const {router} = this.main;
    const {datear, dateo, ...currentParams} = router.queryParams ? toJS(router.queryParams) : {};
    let params;
    if (!replace) {
      newParams = {...currentParams, ...newParams};
    }
    if (dateo) {
      newParams.dateo = dateo;
    }
    this.main.goTo('campaign', this.main.router.params, cleanObject(newParams));
  }

  queryDateos = () => {
    let params = this.getCurrentDateoQueryParams();
    params.narrow_on_tags = this.data.campaign.main_tag.tag;
    params.limit = this.main.ui.isMobile ? 100 : 200;
    if (params.tags) {
      params.tags = decodeURIComponent(params.tags);
    }
    this.main.dateo.getDateos(params, true)
    .then( res => {
      this.main.ui.setLoading(false);
      const openDateoId = this.main.router.queryParams && this.main.router.queryParams.dateo;
      if (openDateoId && this.main.dateo.data.dateos.has(String(openDateoId))) {
        this.map.navigateToLayer(openDateoId);
      }
      /*} else {
        const ids = this.main.dateo.data.dateos.keys();
        if (ids.length) {
          this.main.openDateo(ids[0]);
        } else if (openDateoId) {
          this.main.closeDateo();
        }
      }*/
    })
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

  @action setLayout = (layout) => {
    this.layoutMode = layout;
  }

  @action showOverview = () => {
    this.main.closeDateo();
    this.map.fitBoundsToLayers();
  }

  dispose = () => {
    this.disposeReactions();
    this.map.dispose();
    this.main.dateo.clearDateos();
    this.data.campaign = null;
  }
}
