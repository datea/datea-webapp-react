import {observable, action, computed, autorun, reaction, runInAction, toJS, when} from 'mobx';
import {routerStateToUrl} from 'mobx-state-router';
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
  @observable visualViewMode = 'map';

  prevLayoutMode = 'content';

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
    //this.map = new MapStore(this.main, 'campaign', this.onMarkerClick);
  }

  @action loadView = (user, slug, showLoading = true) => {
    !!showLoading && this.main.ui.setLoading(true);
    Api.campaign.getList({user, slug})
    .then(res => runInAction(() => {
      if (res.objects.length == 1) {
        this.data.campaign = this.hydrateCampaign(res.objects[0]);
        this.setMetaData(this.main.router.routerState.queryParams.dateo);
        this.initReactions();
        if (this.visualViewMode == 'map') {
          this.createMap();
        }
      }else{
        this.main.ui.show404();
      }
    }))
    .catch((err) => console.log(err));
  }

  initReactions = () => {

    this.disposeDateoQueryReaction = reaction(
      () => {
        const {datear, dateo, slideshow, lang,...params} = this.main.router.routerState.queryParams;
        return qs.stringify(params || {});
      },
      (params) => this.queryDateos(),
      {fireImmediately: true}
    );

    this.disposeDetailViewReaction = reaction(
      () => {
        const {queryParams} =  this.main.router.routerState;
        return !!queryParams.dateo && parseInt(queryParams.dateo);
      },
      dateoId => {
        this.data.showDateoDetail = dateoId;
        if (dateoId) {
          if (this.main.dateo.dateos.has(dateoId)) {
            setTimeout(() => this.map.navigateToLayer(dateoId), 50);
          } else if (this.main.ui.loading) {
            when(
              () => !this.main.ui.loading,
              () => {
                if (this.main.dateo.dateos.has(dateoId)) {
                  setTimeout(() => this.map.navigateToLayer(dateoId), 50);
                } else {
                  this.data.showDateoDetail = false;
                }
              }
            )
          }
        }
      },
      {fireImmediately: true, delay: 1}
    );
  }

  disposeReactions = () =>  {
    !!this.disposeDateoQueryReaction && this.disposeDateoQueryReaction();
    !!this.disposeDetailViewReaction && this.disposeDetailViewReaction();
  }

  createMap = () => {
    this.map = new MapStore(this.main, 'campaign', this.onMarkerClick);
    const {boundary: geometry, center, zoom} = this.data.campaign;
    this.map.createMap({center, zoom, geometry});
  }

  getCurrentDateoQueryParams = () => {
    const {routerState} = this.main.router;
    const {datear, dateo, lang, slideshow, ...params} = routerState.queryParams;
    return params;
  }

  @action setQueryParams = (newParams, replace = true) => {
    const {routerState} = this.main.router;
    const {datear, dateo, lang, slideshow, ...currentParams} = routerState.queryParams;
    let params;
    if (!replace) {
      newParams = {...currentParams, ...newParams};
    }
    if (dateo) {
      newParams.dateo = dateo;
    }
    this.main.router.goTo('campaign', routerState.params, cleanObject(newParams));
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
      const openDateoId = this.main.router.routerState.queryParams.dateo;
      if (openDateoId && this.main.dateo.dateos.has(openDateoId)) {
        this.map.navigateToLayer(openDateoId);
      }
      /*} else {
        const ids = this.main.dateo.dateos.keys();
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
          color : campaign.settings.subtags[tag.tag].color,
          dateo_count : tag.dateo_count
        }
      })
    } else {
      subtagArray = campaign.secondary_tags.map( (tag, i) => {
        return {
          tag: tag.tag,
          order : i,
          color: getColor(i),
          dateo_count : tag.dateo_count
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
    console.log('id', id, typeof(id));
    this.main.openDateo({dateo: id});
  }

  @action setLayout = (layout) => {
    this.layoutMode = layout;
    if (layout != this.prevLayoutMode) {
      this.main.backButton.updateBackButtonConfig();
    }
    this.prevLayoutMode = layout;
  }

  @action setVisualMode = (val) => {
    this.visualViewMode = val;
    if (this.visualViewMode == 'map') {
      this.createMap();
      this.updateFeatures();
    } else {
      this.map.dispose();
    }
  }

  @action showOverview = () => {
    this.main.closeDateo();
    this.map.fitBoundsToLayers();
  }

  @action setMetaData = (dateoId) => {
    let data;
    if (!dateoId) {
      const campaign = this.data.campaign;
      this.main.metaData.set({
        title: {
          id: 'METADATA.CAMPAIGN.TITLE',
          params : {
            username: campaign.user.username,
            name : campaign.name,
            mainTag : campaign.main_tag.tag
          },
        },
        description : {
          id: 'METADATA.CAMPAIGN.DESCRIPTION',
          params : {
            username: campaign.user.username,
            name : campaign.name,
            mainTag : campaign.main_tag.tag,
            shortDesc : campaign.short_description
          },
        },
        imgUrl : !!campaign.image ? campaign.image.image : false,
        hashtags : [campaign.main_tag.tag]
      });
    } else {
      this.main.dateo.setMetaData(parseInt(dateoId), routerStateToUrl(this.main.router, this.main.router.routerState));
    }
  }

  dispose = () => {
    this.disposeReactions();
    this.map.dispose();
    this.main.dateo.clearDateos();
    this.data.campaign = null;
  }
}
