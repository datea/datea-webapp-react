import {observable, action, computed, autorun, reaction, runInAction, toJS} from 'mobx';
import {scaleOrdinal, schemeCategory10} from 'd3';
import Api from '../rest-api';
import MapStore from './map';
import config from '../../config';
import {reduceIntoObjById} from '../../utils';

const colors = scaleOrdinal(schemeCategory10);
const getColor = i => colors(i%10);

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
      showLoading && this.main.ui.setLoading(false);
      if (res.objects.length == 1) {
        this.data.campaign = this.hydrateCampaign(res.objects[0]);
        this.main.dateo.query({...DATEO_QUERY_DEFAULTS, tags: this.data.campaign.main_tag.tag});
      }else{
        this.main.ui.show404();
      }
    }))
    .catch((err) => console.log(err));
  }

  hydrateCampaign = (campaign) => {
    campaign.subTags = campaign.secondary_tags.reduce((result, item, i) => {
      result[item.tag] = Object.assign({}, item, {color: getColor(i)});
      return result;
    }, {});
    return campaign;
  }

  onMarkerClick = (id, latLng) => {
    console.log('onMarkerClick', id, latLng);
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
