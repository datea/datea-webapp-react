import d3 from 'd3';
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

  constructor(campaign) {
    this.campaign = campaign;
    this.initSizeRange();
  }

  buildClusterIcon(cluster) {

		const children = cluster.getAllChildMarkers(),
		  numItems = children.length,
		  diameter = this.clusterSizeRange(children.length),
		  dataObj  = {};

		children.forEach(marker => {
			marker.options.tags.forEach(tag => {
				if (tag != this.campaign.main_tag.tag && !!this.campaign.subTags[tag]) {
					if (!!dataObj[tag]) {
						dataObj[tag].value ++;
						dataObj[tag].ids.push( marker.options._id );
					}else{
						dataObj[tag] = { label: '#'+tag, value : 1, tag: tag, ids: [ marker.options._id ]};
					}
				}
			});
		});

		const data = Object.values(dataObj);

		const html = this.makeSVGPie({
	     numItems,
       diameter,
			 data
		});

		return new L.DivIcon({
			  html
			, className: CLUSTER_OPTIONS.clusterIconClassName
			, iconSize: new L.Point(diameter+1,diameter+1)
		});
  }

  initSizeRange(domain = [0,100], range = [50,80]) {
    this.clusterSizeRange = d3.scale.linear()
      .domain( domain )
      .range( range )
      .clamp( true );
  }

  makeSVGPie({ data, diameter, numItems}) {

    const radius = diameter / 2 ;
    const svg = document.createElementNS( d3.ns.prefix.svg, 'svg' );
    const vis = d3.select( svg ).data( [ data ] )
      .attr( 'class', 'datea-svg-cluster' )
      .attr( 'width', diameter )
      .attr( 'height', diameter )
      .append( 'svg:g' )
      .attr( 'transform', 'translate('+radius+','+radius+')' );

    const arc  = d3.svg.arc().outerRadius(radius);
    const pie  = d3.layout.pie().value( sData => Data.value );
    const arcs = vis.selectAll( 'g._sqCellSlice' ).data( pie ).enter().append( 'svg:g' ).attr( 'class', 'slice' );
    arcs.append( 'svg:path' )
    .attr( 'fill', slice => {
      if ( ( this.campaign && !this.campaign.secondary_tags.length )) {
        return CLUSTER_OPTIONS.defaultColor;
      } else if ( slice.data.tag === 'Otros' ) {
        return CLUSTER_OPTIONS.defaultColor1;
      } else {
        return this.campaign.subTags[slice.data.tag].color;
      }
    })
    .attr( 'data-svg-slice-id', slice => slice.data.ids)
    .attr( 'd', arc )
    .attr( 'opacity', CLUSTER_OPTIONS.clusterPieOpacity );

    if (givens.numItems > 1) {
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
         .text( givens.numItems );
    }

    return this.serializeXmlNode( svg );

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
