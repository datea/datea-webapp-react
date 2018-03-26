import {observable, action, computed, autorun, reaction, runInAction, toJS, observe, when} from 'mobx';
import L from 'leaflet';
import config from '../../../config';
import {defaultLayerColor} from '../../../config/colors';
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
    minZoom : config.mapOpts.minZoom,
    maxZoom: config.mapOpts.maxZoom,
    touch: true,
    touchZoom: true,
    scrollWheelZoom: false
  };
  @observable DOMElementAvailable = false;
  @observable mapMounted = false;
  @observable layersLoaded = false;

  markers = new Map();
  geometryCollections = new Map();

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

      this.updateMarkers(dateos);
      this.updateGeometryCollections(dateos);

      this.fitBoundsToLayers();
      this.layersLoaded = true;
    });
  }

  updateMarkers(dateos) {

    const removeIds = [...this.markers.keys()].filter(id => !dateos.has(id));
    const addIds = [...dateos.keys()].filter(id => !!dateos.get(id).position && !this.markers.has(id));

    if (removeIds.length) {
      // remove all markers at once if necessary
      if (removeIds.length == this.markers.size) {
        this.markerLayer.clearLayers();
        this.geometryCollections.clear();
      } else {
        const removeMarkers = removeIds.map(id => this.geometryCollections.get(id)).filter(m => !!m);
        this.markerLayer.removeLayers(removeMarkers);
        removeIds.forEach(id => this.markers.delete(id));
      }
    }

    if (addIds.length) {
      let addMarkers = [];
      addIds.forEach( id => {
        let marker = this.markerFactory.buildMarker(dateos.get(id));
        if (marker) {
          marker.on('click', this.onLayerClick);
          addMarkers.push(marker);
          this.markers.set(id, marker);
        }
      });
      this.markerLayer.addLayers(addMarkers);
    }
  }

  updateGeometryCollections = (dateos) => {

    const removeIds = [...this.geometryCollections.keys()].filter(id => !dateos.has(id));
    const addIds = [...dateos.keys()].filter(id => !!dateos.get(id).geometry_collection && !this.geometryCollections.has(id));

    if (removeIds.length) {
      // remove all markers at once if necessary
      if (removeIds.length == this.geometryCollections.size) {
        this.geometryCollectionLayer.clearLayers();
        this.geometryCollections.clear();
      } else {
        const removeCollections = removeIds.map(id => this.geometryCollections.get(id)).filter(m => !!m);
        removeCollections.forEach( col => {
          this.geometryCollectionLayer.removeLayer(col);
        });
        removeIds.forEach(id => this.geometryCollections.delete(id));
      }
    }

    if (addIds.length) {
      let addMarkers = [];
      addIds.forEach( id => {
        const dateo = dateos.get(id);
        const color = this.getGeometryColor(dateo);
        const layer = L.geoJSON(dateo.geometry_collection, {
          style : {color},
          onEachFeature: (feat, layer) => {
              layer.options = {_id: id};
              layer.on('click', this.onLayerClick);
          }
        });
        this.geometryCollections.set(id, layer);
        this.geometryCollectionLayer.addLayer(layer);
      });
    }
  }

  getGeometryColor(dateo) {
    if (this.mappingType == 'campaign') {
      const {subtags} = this.getMapping();
      if (subtags.size && dateo.tags && dateo.tags.length) {
        let colors = [];
        dateo.tags.peek().forEach(t => {
          if (subtags.has(t)) {
            colors.push({color: subtags.get(t).color, order: subtags.get(t).order});
          }
        })
        if (colors.length) {
          colors = _.sortBy(colors, 'order');
          return colors[0].color;
        } else {
          return defaultLayerColor;
        }
      } else{
        return defaultLayerColor;
      }
    } else {
      return defaultLayerColor;
    }
  }

  /*  ACTIONS */

  @action setDOMElement = (elem) => {
    this.domElement = elem;
    this.DOMElementAvailable = true;
  }

  @action createMap = async ({center, zoom, geometry}) => {

    let bounds;

    if (geometry) {
      const cab = this.getGeometryCenterAndBounds(geometry);
      center = cab.center;
      bounds = cab.bounds;
    } else if (center && zoom) {
      center = this.parseCenterToLatLng(center);
      this.mapState.zoom = zoom;
    } else {
      try {
        const loc = await this.main.user.getLocation();
        center = L.latLng(loc.lat, loc.lng);
        const radius = loc.accuracy * 2 >= 200 ? loc.accuracy * 2 : 200;
        bounds = center.toBounds(radius);
        this.mapState.center = L.latLng(loc.lat, loc.lng);
      } catch (e) {
        console.log('no user location');
      }
    }
    this.mapState.center = center;

    when(() => this.DOMElementAvailable, () => {
      this.lmap = L.map(this.domElement, this.mapState);
      var tileUrl = config.mapOpts.tileUrl.replace('${token}', config.keys.mapbox);
    	var tileAttrib= config.mapOpts.tileAttribution;
      const {minZoom, maxZoom} = this.mapState;
    	var tileLayer = new L.TileLayer(tileUrl, {minZoom, maxZoom, attribution: tileAttrib, id: 'mapbox.streets'});
      this.lmap.addLayer(tileLayer);
      this.addMapEvents();

      this.markerLayer = new L.markerClusterGroup({
        iconCreateFunction : this.clusterFactory.buildClusterIcon,
        pmIgnore: true
      });
      this.geometryCollectionLayer = new L.featureGroup([], {
        pmIgnore: true
      });

      this.lmap.addLayer(this.geometryCollectionLayer);
      this.lmap.addLayer(this.markerLayer);
      this.mapMounted = true;
      this.initAutoRunCycle();
    });
  }

  @action setCenter = (latLng) => { this.mapState.center = latLng };

  @action resizeMap = () => {
    setTimeout( () => !!this.lmap && this.lmap.invalidateSize({animate: true, debounceMoveend: true}), 50)
  }

  @action navigateToLayer = (dateoId) => {
    when(() => this.layersLoaded, () => {
      let marker = this.markers.get(String(dateoId));
      if (marker) {
        this.markerLayer.zoomToShowLayer(marker, () => {
          this.setMap(marker.getLatLng(), this.lmap.getZoom());
          this.focusMarker(marker);
        });
      } else {
        let layer = this.geometryCollections.get(String(dateoId));
        if (layer) {
          this.lmap.fitBounds(layer.getBounds());
        }
      }
    })
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

  @action fitBoundsToLayers = () => {
    let boundList = [];
    if (this.markers.size > 1) {
      boundList.push(this.markerLayer.getBounds());
    } else if (this.markers.size == 1){
      boundList.push(this.markers.values()[0].getLatLng().toBounds(200));
    }
    if (this.geometryCollections.size > 0) {
      boundList.push(this.geometryCollectionLayer.getBounds());
    }

    if (boundList.length) {
      let bounds;
      boundList.forEach( b => {
        bounds = bounds ? bounds.extend(b) : b;
      })
      !!this.lmap && this.lmap.fitBounds(bounds);
    }
  }

  /* EVENTS */

  onLayerClick = (e) => {
    !!this.onItemClick && this.onItemClick(e.target.options._id, e.latlng);
  }

  /* HELPER FUNCTIONS */

  getGeometryCenterAndBounds(geometry) {
    let center, bounds;
    if (geometry.type == 'Point') {
      center = L.latLng([...geometry.coordinates].reverse());
      bounds = center.toBounds(200);
    } else {
      bounds = geometry.coordinates.map( p => [...p].reverse());
      const cent = centroid(geometry);
      center = L.latLng(cent.coordinates.reverse());
    }
    return {center, bounds};
  }

  parseCenterToLatLng = (val) => {
    if (typeof val == 'object') {
      if (val.type && (val.coordinates || val.geometries)) {
        let {center} = this.getGeometryCenterAndBounds(val);
        return center;
      } else if (!!val.lat && !!val.lng) {
        return L.latLng(val);
      }
    }else if (Array.isArray(val)) {
      return L.latLng(val);
    }
  }

  unfocusMarker() {
    if (this.focusedMarker) {
      this.focusedMarker.refreshIconOptions({'className': 'datea-marker-icon'});
    }
  }

  focusMarker(marker) {
    this.unfocusMarker();
    this.focusedMarker = marker;
    marker.refreshIconOptions({'className': 'datea-marker-icon selected'})
  }

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
