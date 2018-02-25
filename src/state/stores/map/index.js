import {observable, action, computed, autorun, reaction, runInAction, toJS, observe} from 'mobx';
import L from 'leaflet';
import 'leaflet.markercluster';
import ClusterPieFactory from './ClusterPie';
import MapMarkerfactory from './MapMarker';

const FLY_TO_ZOOM = 16;

const ResizeMapEvent = new Event('ResizeMapEvent');
export {ResizeMapEvent};

export default class MapeoStore {

  /* OBSERVABLES */
  @observable mapState = {
    zoom: 14,
    center: null,
    maxBounds : null,
    minZoom : 2,
    maxZoom: 19,
    scrollWheelZoom: false
  };
  markers = new Map();
  @observable mapMounted = false;

  constructor(main, mappingType, onItemClick) {
    this.main = main;
    this.mappingType = mappingType;
    this.onItemClick = onItemClick;
    this.markers = new Map();
    this.clusterFactory = new ClusterPieFactory(this.main, mappingType);
    this.markerFactory  = new MapMarkerfactory(this.main, mappingType);
    window.addEventListener('ResizeMapEvent', this.resizeMap);
  }

  getMapping () {
    return this.main[this.mappingType+'View'].data[this.mappingType];
  }

  /* REACTIONS - AUTORUN */
  initAutoRunCycle = () => {

    !!this.disposeDateoAutorun && this.disposeDateoAutorun();

    this.disposeDateoAutorun = autorun(() => {
      const mapping = this.getMapping();
      const {dateos} = this.main.dateo.data;

      if (!this.mapMounted || !mapping || !mapping.id) return;

      const removeIds = [...this.markers.keys()].filter(id => !dateos.has(id));
      const addIds = [...dateos.keys()].filter(id => !this.markers.has(id));

      if (removeIds.length) {
        // remove all markers at once if necessary
        if (removeIds.length == this.markers.size) {
          this.markerLayer.clearLayers();
          this.markers.clear();
        } else {
          const removeMarkers = removeIds.map(id => this.markers.get(id)).filter(m => !!m);
          this.markerLayer.removeLayers(removeMarkers);
          removeIds.forEach(id => this.markers.delete(id));
        }
      }

      if (addIds.length) {
        let addMarkers = [];
        addIds.forEach( id => {
          let marker = this.markerFactory.buildMarker(dateos.get(id));
          if (marker) {
            marker.on('click', this.onMarkerClick);
            addMarkers.push(marker);
            this.markers.set(id, marker);
          }
        });
        this.markerLayer.addLayers(addMarkers);
        this.fitBoundsToDateos();
      }
    });
  }

  /*  ACTIONS */

  @action createMap = async (element) => {
    if (!this.center) {
      try {
        const loc = await this.main.user.getLocation();
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

    this.markerLayer = new L.markerClusterGroup({
      iconCreateFunction : this.clusterFactory.buildClusterIcon
    });
    this.lmap.addLayer(this.markerLayer);
    this.initAutoRunCycle();
    this.mapMounted = true;
  }

  @action setCenter = (latLng) => { this.mapState.center = latLng };

  @action resizeMap = () => {
    setTimeout( () => !!this.lmap && this.lmap.invalidateSize({animate: true, debounceMoveend: true}), 50)
  }

  @action navigateToDateo = (dateoId) => {
    const marker = this.markers.get(String(dateoId));
    !!marker && this.markerLayer.zoomToShowLayer(marker);
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
    const {dateos} = this.main.dateo.data;
    const boundsArray = dateos.values()
                        .filter(d => !!d.position && !!d.position.coordinates)
                        .map(d => [...d.position.coordinates].reverse());
    if (boundsArray.length > 2) {
      !!this.lmap && this.lmap.fitBounds(boundsArray);
    } else if (boundsArray.length == 1) {
      const dateo = dateos.entries().filter(d => !!d.position && !!d.position.coordinates)[0];
      this.navigateToDateo(dateo.id);
    }
  }

  @action destroyMap = () => {
    !!this.lmap && this.lmap.remove();
  }

  /* EVENTS */

  onMarkerClick = (e) => !!this.onItemClick && this.onItemClick(e.target.options._id, e.latlng);

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

  dispose() {
    this.disposeDateoObserver();
    this.markers.remove();
    this.lmap.remove();
    this.lmap = null;
    this.markers = null;
    window.removeEventListener('ResizeMapEvent', this.resizeMap);
    this.mapMounted = false;
  }
}
