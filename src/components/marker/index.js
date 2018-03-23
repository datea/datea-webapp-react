import './marker.scss';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';

const MARKER_CONFIG = {
  width        : 29,
  height       : 42,
  defaultColor : '#28BC45',
  path         : `M14.087,0.485c-7.566,0-13.694,6.133-13.698,13.695c0.027,3.938,2.02,8.328,4.637,10.878c2.615,3.363,6.536,8.889,6.488,11.033v0.07c0,4.195,0.364,3.92,0.4,4.051c0.128,0.441,0.527,0.746,0.99,0.746h2.179c0.464,0,0.858-0.309,0.983-0.74c0.04-0.137,0.407,0.139,0.411-4.057c0-0.039-0.004-0.059-0.004-0.068c-0.038-2.047,3.399-7.35,6.109-10.877c2.875-2.498,5.175-6.814,5.196-11.035C27.779,6.618,21.65,0.485,14.087,0.485z`
};

const MarkerDefs = ({children}) =>
  <defs>
    <filter id="markerShadow" x="0" y="0" width="101%" height="101%">
      <feDropShadow in="StrokePaint" dx="1" dy="1" stdDeviation="4" />
    </filter>
    <clipPath id="markerPinPath">
      <path d={MARKER_CONFIG.path} />
    </clipPath>
    {children}
  </defs>

const DefaultMarkerIcon = () =>
  <svg width={MARKER_CONFIG.width} height={MARKER_CONFIG.height}>
    <g style={{clipPath: 'url(#markerPinPath)'}}>
      <rect height={MARKER_CONFIG.height} width={MARKER_CONFIG.width} fill={MARKER_CONFIG.defaultColor} x={0} y={0} />
      <circle cx="14.5" cy="13" r="4" fill="white" />
      <path className="marker-border" d={MARKER_CONFIG.path} stroke="#888888" fill="none" strokeWidth="1" />
    </g>
  </svg>


const CampaignMarkerIcon = ({dateo, subtags})  => {
  const coloredTags = dateo.tags
                      .map(tag => typeof tag == 'string' ? tag : tag.tag)
                      .filter(tag => subtags.has(tag));
  const catWidth = MARKER_CONFIG.width / coloredTags.length;
  return (
    <svg width={MARKER_CONFIG.width} height={MARKER_CONFIG.height}>
      <g style={{clipPath: 'url(#markerPinPath)'}}>
        {!!coloredTags.length && coloredTags.map((tag, i) =>
          <rect key={tag} height={MARKER_CONFIG.height} width={catWidth} fill={subtags.get(tag).color} x={i*catWidth} y={0} />
        )}
        {!coloredTags.length &&
          <rect height={MARKER_CONFIG.height} width={MARKER_CONFIG.width} fill={MARKER_CONFIG.defaultColor} x={0} y={0} />
        }
      </g>
      <g>
        <path className="marker-border" d={MARKER_CONFIG.path} stroke="#888888" fill="none" strokeWidth="1" />
        <circle cx="14.5" cy="13" r="4" fill="white" />
      </g>
    </svg>
  )
}


const buildMarkerIcon = (svg) => {
  svg = svg || <DefaultMarkerIcon />;
  return L.divIcon({
      iconSize    : [MARKER_CONFIG.width, MARKER_CONFIG.height],
      iconAnchor  : [MARKER_CONFIG.width/2, MARKER_CONFIG.height],
      popupAnchor : [0, -33],
      labelAnchor : [8, -25],
      html        : ReactDOMServer.renderToStaticMarkup(svg),
      className   : 'datea-marker-icon',
  });
}

export {MARKER_CONFIG, MarkerDefs, DefaultMarkerIcon, CampaignMarkerIcon, buildMarkerIcon};
