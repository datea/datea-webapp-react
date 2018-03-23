import * as d3 from "d3";
import L from 'leaflet';

const CLUSTER_OPTIONS = {
  defaultColor         : '#28BC45',
	defaultColor1        : '#CCC',
	clusterIconClassName : 'marker-cluster',
  clusterPieOpacity    : 0.75,
	polygonOptions       : {
    weight      : 1,
	  fillColor   : '#999',
	  color       : '#999',
	  fillOpacity : 0.4
	}
}

export default class ClusterPieFactory {

  constructor(main, mappingType) {
    this.main = main;
    this.mappingType = mappingType;
    this.initSizeRange();
  }

  setMapping(mapping) {
    this.mapping = mapping;
  }

  buildClusterIcon = (cluster) => {
		const children = cluster.getAllChildMarkers(),
		  numItems = children.length,
		  diameter = this.clusterSizeRange(children.length),
		  dataObj  = {},
      mapping  = this.getMapping();

    if (mapping.subtags) {
  		children.forEach(marker => {
  			marker.options._tags.forEach(tag => {
  				if (tag != mapping.main_tag.tag && mapping.subtags.has(tag)) {
  					if (!!dataObj[tag]) {
  						dataObj[tag].value ++;
  						dataObj[tag].ids.push( marker.options._id );
  					}else{
  						dataObj[tag] = { label: '#'+tag, value : 1, tag: tag, ids: [ marker.options._id ]};
  					}
  				}
  			});
  		});
    }

		const data = Object.values(dataObj);
		const html = this.makeSVGPie({
	     numItems,
       diameter,
			 data
		});

		return L.divIcon({
			  html
			, className: CLUSTER_OPTIONS.clusterIconClassName
			, iconSize: L.point(diameter+1,diameter+1)
		});
  }

  initSizeRange(domain = [0,100], range = [50,80]) {
    this.clusterSizeRange = d3.scaleLinear()
      .domain( domain )
      .range( range )
      .clamp( true );
  }

  makeSVGPie({ data, diameter, numItems}) {

    const mapping = this.getMapping();
    const radius = diameter / 2 ;
    const svg = document.createElementNS(d3.namespaces.svg, 'svg');
    const vis = d3.select( svg ).data( [ data ] )
      .attr( 'class', 'datea-svg-cluster' )
      .attr( 'width', diameter )
      .attr( 'height', diameter )
      .append( 'svg:g' )
      .attr( 'transform', 'translate('+radius+','+radius+')' );

    if (mapping.subtags) {
      const arc  = d3.arc().outerRadius(radius).innerRadius(0);
      const pie  = d3.pie().value( sData => sData.value);
      const arcs = vis.selectAll( 'g._sqCellSlice' ).data( pie ).enter().append( 'svg:g' ).attr( 'class', 'slice' );
      arcs.append( 'svg:path' )
      .attr( 'fill', slice => {
        if ( slice.data.tag === 'Otros' ) {
          return CLUSTER_OPTIONS.defaultColor1;
        } else {
          return mapping.subtags.get(slice.data.tag).color;
        }
      })
      .attr( 'data-svg-slice-id', slice => slice.data.ids)
      .attr( 'd', arc )
      .attr( 'opacity', CLUSTER_OPTIONS.clusterPieOpacity );

    } else {
      vis.append('circle')
  			.attr("fill", CLUSTER_OPTIONS.defaultColor)
  			.attr("r", radius)
  			.attr("cx", 0)
  			.attr("cy", 0)
  			.attr("opacity", CLUSTER_OPTIONS.clusterPieOpacity);
    }

    if (numItems > 1) {
      vis.append( 'circle' )
         .attr( 'fill', '#fff' )
         .attr( 'r', radius / 2.2 )
         .attr( 'cx', 0 )
         .attr( 'cy', 0 );

      vis.append( 'text' )
         .attr( 'x', 0 )
         .attr( 'y', 0 )
         .attr( 'class', 'cpie-label' )
         .attr( 'text-anchor', 'middle' )
         .attr( 'dy', '.33em' )
         .text( numItems );
    }

    return this.serializeXmlNode( svg );

  }

  getMapping() {
    return this.main[this.mappingType+'View'].data[this.mappingType];
  }

  serializeXmlNode ( xmlNode ) {
    if ( typeof window.XMLSerializer !== 'undefined' ) {
      return ( new window.XMLSerializer() ).serializeToString( xmlNode );
    } else if ( typeof xmlNode.xml !== 'undefined' ) {
      return xmlNode.xml;
    }
    return '';
  }
}
