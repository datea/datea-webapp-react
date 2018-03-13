import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {MARKER_CONFIG, MarkerDefs, DefaultMarkerIcon, buildMarkerIcon} from '../../../config';

export default class MapMarkerFactory {

  constructor(main, mappingType) {
    this.main = main;
    this.mappingType = mappingType;
  }

  getMapping() {
    return this.main[this.mappingType+'View'].data[this.mappingType];
  }

  buildMarker(dateo) {

      if (!dateo.position || !dateo.position.coordinates) return false;

			let tags = [];
			let labelTags = [];
      const mapping = this.getMapping();

    	dateo.tags.forEach(tag => {
				!!mapping.subTags && mapping.subTags[tag] && labelTags.push('#'+tag);
				tags.push(tag);
			});

			return L.marker(
        L.latLng([...dateo.position.coordinates].reverse()),
        {
          group       : !!mapping.main_tag ? mapping.main_tag.tag : 'dateos',
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
    const mapping = this.getMapping();
    let markerSVG;

    if (mapping.subTags) {

      const coloredTags = dateo.tags
                          .map(tag => typeof tag == 'string' ? tag : tag.tag)
                          .filter(tag => !!mapping.subTags[tag]);
      const catWidth = MARKER_CONFIG.width / coloredTags.length;

  		markerSVG = (
        <svg width={MARKER_CONFIG.width} height={MARKER_CONFIG.height}>
          <MarkerDefs />
          <g style={{clipPath: 'url(#markerPinPath)'}}>
    		    {coloredTags.map((tag, i) =>
              <rect key={tag} height={MARKER_CONFIG.height} width={catWidth} fill={mapping.subTags[tag].color} x={i*catWidth} y={0} />
            )}
  				</g>

          <path d={MARKER_CONFIG.path} stroke="#888888" fill="blue" strokeWidth="1" style={{filter:'url(#markerShadow)'}} />
          <circle cx="14.5" cy="13" r="4" fill="white" />
        </svg>
      );

    } else {
      markerSVG = <DefaultMarkerIcon />;
    }

    return buildMarkerIcon(markerSVG);
	}
}
