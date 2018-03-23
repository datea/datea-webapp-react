import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {observable, action, autorun, runInAction, toJS, when} from 'mobx';
import {centroid} from 'turf';
import Api from '../../rest-api';
import {buildMarkerIcon} from '../../../components/marker';
import config from '../../../config';
import L from 'leaflet';
import 'leaflet.pm';

const FLY_TO_ZOOM = 16;

const ResizeMapEvent = new Event('ResizeMapEvent');
export {ResizeMapEvent};

export default class MapeoStore {

  /* OBSERVABLES */
  @observable state = {
    map : {
      zoom: 14,
      center: null,
      maxBounds : null,
      minZoom : config.map.minZoom,
      maxZoom: config.map.maxZoom,
      scrollWheelZoom: false,
      touch: true,
      touchZoom: true
    },
    geometry : {
      type: 'Point',
      coordinates : null
    },
    DOMElementAvailable : false
  };
  @observable mapMounted = false;

  constructor(main, options) {
    this.main = main;
    this.options = options;
    if (options && options.geometryType) {
      this.state.geometry.type = options.geometryType;
    }
  }

  @action setDOMElement(elem) {
    this.domElement = elem;
    this.state.DOMElementAvailable = true;
  }

  /*  ACTIONS */
  @action createMap = async ({center, zoom, geometry}) => {
    var bounds, setInitialMarker = false;

    if (geometry) {
      const cab = this.getGeometryCenterAndBounds(geometry);
      center = cab.center;
      bounds = cab.bounds;
      this.state.geometry = geometry;

    } else if (center && zoom ) {
      center = this.parseCenterToLatLng(center);
      this.state.map.zoom = zoom;
    } else {
      try {
        const loc = await this.main.user.getLocation();
        center = L.latLng(loc.lat, loc.lng);
        const radius = loc.accuracy * 2 >= 200 ? loc.accuracy * 2 : 200;
        bounds = center.toBounds(radius);
        setInitialMarker = this.state.geometry.type == 'Point';
      } catch (e) {
        console.log('user geolocation', e);
      }
    }
    this.state.map.center = center;

    when(() => this.state.DOMElementAvailable, () => {
      this.lmap = L.map(this.domElement, this.state.map);
      var tileUrl = config.map.tileUrl.replace('${token}', config.keys.mapbox);
    	var tileAttrib= config.map.tileAttribution;
      const {minZoom, maxZoom} = this.state.map;
    	var tileLayer = new L.TileLayer(tileUrl, {minZoom, maxZoom, attribution: tileAttrib, id: 'mapbox.streets'});
      this.lmap.addLayer(tileLayer);
      this.addMapEvents();
      if (bounds) {
        this.lmap.fitBounds(bounds);
      }
      if (this.getType() == 'Point') {
        this.setGeometry(null, setInitialMarker, setInitialMarker);
      } else if (geometry){
        this.setGeometry(geometry);
      } else {
        this.setGeometryType(this.getType());
      }

      this.mapMounted = true;
      window.addEventListener('ResizeMapEvent', this.resizeMap);
    });
  }

  @action setCenter = (latLng) => {
    this.state.map.center = latLng
  };

  @action setGeometry = (geometry, initial = false, revGeocode = false) => {

    geometry = geometry || {
      type : 'Point',
      coordinates : null
    };

    !!this.editLayer && this.lmap.removeLayer(this.editLayer);
    this.editLayer = null;
    this.state.geometry = geometry;

    const type = this.getType();

    if (type == 'Point' && initial) {
      const {center} = this.state.map;
      this.setMarker(center);
      this.state.geometry.coordinates = [center.lng, center.lat];
      !!revGeocode && this.reverseGeocodeMarker(center);

    } else if (type == 'Polygon') {
      this.createPolygonLayer(geometry);

    } else if (type == 'GeometryCollection') {
      this.createCollectionLayer(geometry);
    }

    if ((geometry.coordinates && geometry.coordinates.length)
       || (geometry.geometries && geometry.geometries.length)
       && initial == false) {
       this.setViewOnGeometry(geometry);
    }
  }

  @action setGeometryType = type => {
    !!this.editLayer && this.lmap.removeLayer(this.editLayer);
    this.editLayer = null;

    if (type == 'Point') {
      this.setMarker(this.state.map.center);
    } else if (type == 'Polygon') {
      this.createPolygonLayer();
    } else if ( type == 'GeometryCollection') {
      this.createCollectionLayer();
    }
    this.state.geometry.type = type;
  }

  @action resizeMap = () => {
    setTimeout( () => !!this.lmap && this.lmap.invalidateSize({animate: true, debounceMoveend: true}), 50)
  }

  @action setMap = (center, zoom, maxBounds) => {
    if (zoom) {
      const {minZoom, maxZoom} = this.state.map;
      zoom = zoom < minZoom ? minZoom : (zoom > maxZoom ? maxZoom : zoom);
      this.state.map.zoom = zoom;
    }
    if (maxBounds) {
      this.state.map.maxBounds = maxBounds;
    }
    this.lmap.setView(this.state.map.center, this.state.map.zoom);
    if (maxBounds) this.lmap.setMaxBounds(maxBounds);
  }

  @action setViewOnGeometry(geometry, zoomToBounds = true, action = 'set') {
    const {center, bounds} = this.getGeometryCenterAndBounds(geometry);
    if (geometry.type == 'Point') {
      if (zoomToBounds) {
        this.lmap[action == 'set' ? 'fitBounds' : 'flyToBounds'](bounds);
      } else {
        this.lmap[action == 'set' ? 'setView' : 'flyTo'](center, this.state.map.zoom);
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

  @action createPolygonLayer = (geometry) => {
    !!this.editLayer && this.lmap.removeLayer(this.editLayer);
    this.editLayer = !!geometry ? L.geoJSON(geometry) : L.geoJSON();
    this.editLayer.addTo(this.lmap);
    // define toolbar options
    var options = {
        position: 'topleft',
        drawMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawPolygon: true, // adds button to draw a polygon
        drawCircle: false,
        cutPolygon: false,
        editMode: true, // adds button to toggle edit mode for all layers
        removalMode: true, // adds a button to remove layers
    };
    this.lmap.pm.addControls(options);
  }

  @action createCollectionLayer = (geometry) => {
    !!this.editLayer && this.lmap.removeLayer(this.editLayer);
    this.editLayer = !!geometry ? L.geoJSON(geometry) : L.geoJSON();
    this.editLayer.addTo(this.lmap);
    // define toolbar options
    var options = {
        position: 'topleft',
        drawMarker: false,
        drawPolyline: true,
        drawRectangle: false,
        drawPolygon: true, // adds button to draw a polygon
        drawCircle: false,
        cutPolygon: false,
        editMode: true, // adds button to toggle edit mode for all layers
        removalMode: true, // adds a button to remove layers
    };
    this.lmap.pm.addControls(options);
  }

  @action setMarker = (latLng) => {
    this.lmap.pm.removeControls();
    if (!this.editLayer) {
      this.editLayer = L.marker(latLng, {
        draggable: true,
        autopan: true,
        icon: buildMarkerIcon(),
        pmIgnore: true
      })
      .addTo(this.lmap)
      .on('moveend', ev => {
        const coords = ev.target.getLatLng();
        this.updateMarkerGeometry(coords);
        this.setViewOnMarker(coords);
        this.reverseGeocodeMarker(ev.latLng);
      })
    } else{
      this.editLayer.setLatLng(latLng);
    }
    this.updateMarkerGeometry(latLng);
  }

  @action updateMarkerGeometry = (latLng) => {
    this.state.geometry.type = 'Point';
    this.state.geometry.coordinates = [latLng.lng, latLng.lat];
  }

  @action setViewOnMarker(latLng){
    const {zoom} = this.state.map;
    const {maxZoom} = config.map;
    let newZoom = zoom < maxZoom ? zoom + 2 : zoom;
    newZoom = newZoom > maxZoom ? maxZoom : newZoom;
    this.lmap.setView(latLng, newZoom);
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

  getMapObj = () => {
    return !!this.lmap && this.lmap;
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

  layersToGeometryCollection(layers = []) {
    const geometries = layers.map(l => l.toGeoJSON().geometry);
    return {
      type : 'GeometryCollection',
      geometries: geometries.length ? geometries : null
    }
  }

  reverseGeocodeMarker = (latLng) => {
    Api.reverseGeocode(latLng).then(res => {
      if (res.length) {
        const result = res[0];
        !!this.options.onMarkerPlacedByuser && this.options.onMarkerPlacedByuser(result);
      }
    });
  }

  /* EVENTS */

  addMapEvents = () => {
    this.lmap.on('moveend', () => {
      setTimeout(runInAction(() => {
        this.state.map.center = this.lmap.getCenter();
        this.state.map.zoom = this.lmap.getZoom();
      }), 300);
    });
    this.lmap.on('zoomend', () => {
      setTimeout(runInAction(() => {
        this.state.map.zoom = this.lmap.getZoom();
      }), 300);
    });
    this.lmap.on('click', ev => {
      if (this.getType() == 'Point') {
        this.setMarker(ev.latlng);
        setTimeout(() => this.setViewOnMarker(ev.latlng), 300);
        this.reverseGeocodeMarker(ev.latlng);
      }
    });

    this.lmap.on('pm:create', (e) => {
      const type = this.getType();
      if (type == 'Polygon') {
        this.state.geometry = e.layer.toGeoJSON().geometry;
      } else if (type == 'GeometryCollection') {
        const layers = this.getCurrentDrawnLayers();
        this.state.geometry = this.layersToGeometryCollection(layers);
      }
    });

    this.lmap.on('pm:remove', (e) => {
      const type = this.getType();
      if (type == 'Polygon') {
        this.state.geometry.coordinates = null;
      } else if (type == 'GeometryCollection') {
        const layers = this.getCurrentDrawnLayers();
        this.state.geometry = this.layersToGeometryCollection(layers);
      }
    });

    this.lmap.on('pm:drawstart', (e) => {
      const type = this.getType();
      if (type == 'Polygon') {
        const layers = this.getCurrentDrawnLayers();
        if (layers.length) {
          layers.forEach(l => l.remove());
        }
      }
    })
  }

  /* SOME GETTERS */

  getCurrentDrawnLayers() {
    let layers = [];
    this.lmap.eachLayer(layer => {
      if (layer.pm) {
        if (!layer._layers && (!layer.pm || !layer.pm.dragging()) && (layer.isEmpty && !layer.isEmpty())) {
          layers.push(layer);
        }
      }
    });
    return layers;
  }

  getType() {
    return this.state.geometry.type;
  }

  getGeometry() {
    const geometry = this.state.geometry;
    if (!geometry || geometry.coordinates === null || geometry.geometries === null) {
      return null;
    }
    return toJS(this.state.geometry);
  }

  getCenterAndZoom() {
    return {
      center: {
        type: 'Point',
        coordinates: [this.state.map.center.lng, this.state.map.center.lat]
      },
      zoom: this.state.map.zoom
    };
  }

  dispose() {
    this.disposeDateoObserver();
    this.lmap.remove();
    this.lmap = null;
    window.removeEventListener('ResizeMapEvent', this.resizeMap);
    this.mapMounted = false;
  }
}
