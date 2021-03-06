import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {DefaultMarkerIcon, CampaignMarkerIcon, buildMarkerIcon} from '../../../components/marker';

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
				!!mapping.subtags && mapping.subtags.has(tag) && labelTags.push('#'+tag);
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

    const clipPath = (ENV_TYPE == 'browser' ? document.location.href : '/') + '#pinpath';
    const mapping = this.getMapping();
    let markerSVG = mapping.subtags
                  ? <CampaignMarkerIcon dateo={dateo} subtags={mapping.subtags} />
                  : <DefaultMarkerIcon />

    return buildMarkerIcon(markerSVG);
	}
}
