import {observable, action, computed, autorun, runInAction, toJS} from 'mobx';
import L from 'leaflet';
import 'leaflet.markercluster';
import ClusterPieFactory from './ClusterPie';
import MapMarkerfactory from './MapMarker';

const FLY_TO_ZOOM = 16;

export default class MapeoStore {


  /* OBSERVABLES */
  @observable mapState = {
    zoom: 14,
    center: null,
    maxBounds : null,
    minZoom : 5,
    maxZoom: 19,
  };
  @observable cluster = true;

  constructor(userStore, dateos, campaign) {
    this.userStore = userStore;
    this.dateos = dateos;
    this.campaign = campaign;
  }

  /* RE-ACTIONS AND AUTORUN */


  /*  ACTIONS */

  @action createMap = async (element) => {
    if (!this.center) {
      try {
        const loc = await this.userStore.getLocation();
        this.mapState.center = L.latLng(loc.lat, loc.lng);
      } catch (e) {
      }
    }

    this.lmap = L.map(element, this.mapState);
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    const {minZoom, maxZoom} = this.mapState;
  	var osm = new L.TileLayer(osmUrl, {minZoom, maxZoom, attribution: osmAttrib});
    this.lmap.addLayer(osm);
    this.addMapEvents();
  }

  @action setCenter = (latLng) => { this.mapState.center = latLng };

  @action resizeMap = () => !!this.lmap && this.lmap.invalidateSize({animate: true, debounceMoveend: true});

  @action navigateToDateo = (dateoId) => {
    const dateo = this.dateos.get(dateoId);
    if (dateo.position && dateo.position.coordinates) {
      const latLng = L.latLng([...dateo.position.coordinates].reverse());
      this.lmap.flyTo(latLng, FLY_TO_ZOOM);
    }
  }

  @action setMap = (center, zoom, maxBounds) => {
    if (typeof center == 'object') {
      if (center.coordinates && center.coordinates.length == 2) {
        this.mapState.center = L.latLng([...center.coordinates].reverse());
      } else if (!!center.lat && !!center.lng) {
        this.mapState.center = L.latLng(center);
      }
    }else if (Array.isArray(center)) {
      this.mapState.center = L.latLng(center);
    }
    if (zoom) {
      zoom = zoom < this.mapState.minZoom ? this.mapSTate.minZoom : (zoom > this.mapState.maxZoom ? this.maxZoom : zoom);
      this.mapState.zoom = zoom;
    }
    if (maxBounds) {
      this.mapState.maxBounds = maxBounds;
    }
    this.lmap.setView(this.mapState.center, this.mapState.zoom);
    if (maxBounds) this.lmap.setMaxBounds(maxBounds);
  }

  @action fitBoundsToDateos = () => {
    const boundsArray = this.dateos.entries()
                        .filter(d => !!d.position && !!d.position.coordinates)
                        .map(d => [...d.position.coordinates].reverse());
    if (boundsArray.length > 2) {
      !!this.lmap && this.lmap.fitBounds(boundsArray);
    } else if (boundsArray.length == 1) {
      const dateo = this.dateos.entries().filter(d => !!d.position && !!d.position.coordinates)[0];
      this.navigateToDateo(dateo.id);
    }
  }

  @action destroyMap = () => {
    !!this.lmap && this.lmap.remove();
  }

  /* HELPER FUNCTIONS */

  getMapObj = () => {
    return !!this.lmap && this.lmap;
  }

  addMapEvents = () => {
    this.lmap.on('moveend', () => {
      setTimeout(runInAction(() => {
        this.mapState.center = this.lmap.getCenter();
        this.mapState.zoom = this.lmap.getZoom();
      }), 300);
    });
    this.lmap.on('zoomend', () => {
      setTimeout(runInAction(() => {
        this.mapState.zoom = this.lmap.getZoom();
      }), 300);
    });
  }
}
