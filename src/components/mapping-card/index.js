import './mapping-card.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Card, {CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import PoundIcon from 'material-ui-community-icons/icons/pound';
import MapMarkerMultipleIcon from 'material-ui-community-icons/icons/map-marker-multiple';
import {getImgSrc} from '../../utils';


export default class MappingCard extends Component {

  static propTypes = {
    mapping : PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object
  };

  goToMapping = (ev) => {
    const m = this.props.mapping;
    if (m.type == 'tag') {
      this.context.router.push('/tag/'+m.tag);
    }else{
      this.context.router.push('/'+m.user.username+'/'+m.slug);
    }
  }

  render() {
    const m = this.props.mapping;
    const title = !!m.tag ? '#'+m.tag : m.name;
    const subtitle = (!!m.name ? '#'+m.main_tag.tag : '')+', '+m.dateo_count+' dateos';
    let img;
    if (!!m.tag) {
      img = <div className="mapping-card-img-icon hashtag"><PoundIcon /></div>;
    } else {
      if (m.image && m.image.image) {
        img = <div className="mapping-card-img" style={{backgroundImage: 'url('+getImgSrc(m.image.image)+')'}} />;
      }else{
        img = <div className="mapping-card-img-icon campaign"><MapMarkerMultipleIcon /></div>
      }
    }

    return (
      <Card onClick={this.goToMapping}>
        <CardMedia image={img} />
        <CardContent>
          <Typography variant="headline" component="h3">{title}</Typography>
          <Typography variant="subheading" component="p">{subtitle}</Typography>
        </CardContent>
      </Card>
    )
  }
}
