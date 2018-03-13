import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {observable, action, computed, autorun, reaction, runInAction, toJS, observe} from 'mobx';
import {centroid} from 'turf';
import Api from '../../rest-api';
import config, {buildMarkerIcon} from '../../../config';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

const FLY_TO_ZOOM = 16;

const ResizeMapEvent = new Event('ResizeMapEvent');
export {ResizeMapEvent};

export default class MapeoStore {

  /* OBSERVABLES */
  @observable mapState = {
    zoom: 14,
    center: null,
    maxBounds : null,
    minZoom : config.map.minZoom,
    maxZoom: config.map.maxZoom,
    scrollWheelZoom: false,
    touch: true,
    touchZoom: true,
    mode : 'point'
  };
  @observable mapMounted = false;

  @observable geometry = {
    type: 'Point',
    coordinates : null
  };

  constructor(main, options) {
    this.main = main;
    this.options = options;
  }

  /*  ACTIONS */
  @action createMap = async (element, geometry) => {
    let center, bounds, setInitialMarker = false;
    if (geometry) {
      let {center, bounds} = this.getGeometryCenterAndBounds(geometry);
    } else {
      try {
        const loc = await this.main.user.getLocation();
        center = L.latLng(loc.lat, loc.lng);
        const radius = loc.accuracy * 2 >= 200 ? loc.accuracy * 2 : 200;
        bounds = center.toBounds(radius);
        setInitialMarker = true;
      } catch (e) {
        console.log('user geolocation', e);
      }
    }
    console.log('center', center);


    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
    });

    this.mapState.center = center;
    this.lmap = L.map(element, this.mapState);
    var tileUrl = config.map.tileUrl.replace('${token}', config.keys.mapbox);
  	var tileAttrib= config.map.tileAttribution;
    const {minZoom, maxZoom} = this.mapState;
  	var tileLayer = new L.TileLayer(tileUrl, {minZoom, maxZoom, attribution: tileAttrib, id: 'mapbox.streets'});
    this.lmap.addLayer(tileLayer);
    this.addMapEvents();
    this.mapMounted = true;
    if (bounds) {
      this.lmap.fitBounds(bounds);
    }
    if (setInitialMarker) {
      this.setMarker(center);
      this.reverseGeocodeMarker(center);
    }
    window.addEventListener('ResizeMapEvent', this.resizeMap);
  }

  @action setCenter = (latLng) => { this.mapState.center = latLng };

  @action setMode = mode => {
    if (this.mapState.mode != 'point' && mode == 'point') {

    } else if (this.mapState == 'point' && mode != 'point') {
      this.lmap.removeLayer(this.point);
      this.point = null;
    }
    this.mapState.mode = mode == 'collection' ? 'collection' : 'point';
  }

  @action resizeMap = () => {
    setTimeout( () => !!this.lmap && this.lmap.invalidateSize({animate: true, debounceMoveend: true}), 50)
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

  @action setViewOnGeometry(geometry, zoomToBounds = true, action = 'set') {
    const {center, bounds} = this.getGeometryCenterAndBounds(geometry);
    if (geometry.type == 'Point') {
      if (zoomToBounds) {
        this.lmap[action == 'set' ? 'fitBounds' : 'flyToBounds'](bounds);
      } else {
        this.lmap[action == 'set' ? 'setView' : 'flyTo'](center, this.mapState.zoom);
      }
    } else {
      // get centroid
      if (zoomToBounds) {
        this.lmap[action == 'set' ? 'fitBounds' : 'flyToBounds'](boundsArray);
      }else{
        this.lmap[action == 'set' ? 'setView' : 'flyTo'](center);
      }
    }
  }

  @action destroyMap = () => {
    !!this.lmap && this.lmap.remove();
  }

  @action setMarker = (latLng) => {
    if (!this.point) {
      this.point = L.marker(latLng, {
        draggable: true,
        autopan: true,
        icon: buildMarkerIcon()
      })
      .addTo(this.lmap)
      .on('moveend', ev => {
        const coords = ev.target.getLatLng();
        this.updateMarkerGeometry(coords);
        this.setViewOnMarker(coords);
        this.reverseGeocodeMarker(ev.latLng);
      })
    } else{
      this.point.setLatLng(latLng);
    }
    this.updateMarkerGeometry(latLng);
  }

  @action updateMarkerGeometry = (latLng) => {
    this.geometry.type = 'Point';
    this.geometry.coordinates = [latLng.lng, latLng.lat];
  }

  @action setViewOnMarker(latLng){
    const {zoom} = this.mapState;
    const {maxZoom} = config.map;
    let newZoom = zoom < maxZoom ? zoom + 2 : zoom;
    newZoom = newZoom > maxZoom ? maxZoom : newZoom;
    this.lmap.setView(latLng, newZoom);
  }

  /* HELPER FUNCTIONS */

  setViewOnGeometry = (geometry) => {
    geometry = geometry || this.geometry;
    if (geometry && geometry.coordinates) {
      const {bounds} = this.getGeometryCenterAndBounds(geometry);
      this.lmap.fitBounds(bounds);
    }
  }

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
    this.lmap.on('click', ev => {
      if (this.mapState.mode == 'point') {
        this.setMarker(ev.latlng);
        setTimeout(() => this.setViewOnMarker(ev.latlng), 300);
        this.reverseGeocodeMarker(ev.latlng);
      }
    })
  }

  reverseGeocodeMarker = (latLng) => {
    Api.reverseGeocode(latLng).then(res => {
      if (res.length) {
        const result = res[0];
        !!this.options.onMarkerPlacedByuser && this.options.onMarkerPlacedByuser(result);
      }
    });
  }

  dispose() {
    this.disposeDateoObserver();
    this.lmap.remove();
    this.lmap = null;
    window.removeEventListener('ResizeMapEvent', this.resizeMap);
    this.mapMounted = false;
  }
}
