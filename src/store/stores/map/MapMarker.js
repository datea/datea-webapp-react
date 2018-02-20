import React from 'react';
import ReactDOMServer from 'react-dom/server';


const MARKER_CONFIG = {
  width        : 29,
  height       : 42,
  defaultColor : '#28BC45',
  path         : `M14.087,0.485c-7.566,0-13.694,6.133-13.698,13.695c0.027,3.938,2.02,8.328,4.637,10.878c2.615,3.363,6.536,8.889,6.488,11.033v0.07c0,4.195,0.364,3.92,0.4,4.051c0.128,0.441,0.527,0.746,0.99,0.746h2.179c0.464,0,0.858-0.309,0.983-0.74c0.04-0.137,0.407,0.139,0.411-4.057c0-0.039-0.004-0.059-0.004-0.068c-0.038-2.047,3.399-7.35,6.109-10.877c2.875-2.498,5.175-6.814,5.196-11.035C27.779,6.618,21.65,0.485,14.087,0.485z`
};

export default class MapMarkerFactory {

  constructor(campaign) {
    this.campaign = campagin;
  }

  buildMarker(dateo) {

      if (!dateo.position || !dateo.position.coordinates) return false;

			let tags = [];
			let labelTags = [];

    	dateo.tags.forEach(tag => {
				!!this.campaign.subTags[tag] && labelTags.push('#'+tag);
				tags.push(tag);
			});

			return L.marker(
        L.latLng([...dateo.position.coordinates].reverse()),
        {
          group       : !!this.campaign ? this.campaign.main_tag.tag : 'dateos',
          title       : labelTags.join(','),
          label       : { message: labelTags.join(',') },
    			draggable   : false,
    			_id         : dateo.id,
    			_tags       : tags,
    			icon 			  : this.buildMarkerIcon(dateo),
    			riseOnHover : true
        }
      );
	}

  buildMarkerIcon(dateo) {

    const clipPath = document.location.href + '#pinpath';
    let markerSVG;

    if (this.campaign) {

      const coloredTags = dateo.tags
                          .map(tag => typeof tag == 'string' ? tag : tag.tag)
                          .filter(tag => !!this.campaign.subTags[tag]);
      const catWidth = MARKER_CONFIG.width / coloredTags.length;

  		markerSVG = (
        <svg width={MARKER_CONFIG.width} height={MARKER_CONFIG.height}>
          <g style={{clipPath: 'url('+clipPath+')'}}>
    		    {coloredTags.map(tag =>
              <rect height={MARKER_CONFIG.height} width={catWidth} fill={this.campaign.subTags[tag].color} x={i*catWidth} y={0} />
            )}
    				<circle cx="14.5" cy="13" r="4" fill="white" />
    				<path d={MARKER_CONFIG.path} stroke="#888888" fill="none" stroke-width="1" />
  				</g>
        </svg>
      );

    } else {
      markerSVG = (
        <svg width={MARKER_CONFIG.width} height={MARKER_CONFIG.height}>
          <g style={{clipPath: 'url('+clipPath+')'}}>
            <rect height={MARKER_CONFIG.height} width={MARKER_CONFIG.width} fill={MARKER_CONFIG.defaultColor} x={0} y={0} />
            <circle cx="14.5" cy="13" r="4" fill="white" />
            <path d={MARKER_CONFIG.path} stroke="#888888" fill="none" stroke-width="1" />
          </g>
        </svg>
      );
    }

		return {
		    type        : 'div',
        iconSize    : [MARKER_CONFIG.width, MARKER_CONFIG.height],
        iconAnchor  : [MARKER_CONFIG.width/2, MARKER_CONFIG.height],
        popupAnchor : [0, -33],
        labelAnchor : [8, -25],
        html        : ReactDOMServer.renderToStaticMarkup(markerSVG),
        className   : 'datea-marker-icon',
		}
	}
}
