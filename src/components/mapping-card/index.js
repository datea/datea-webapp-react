import './mapping-card.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Typography from 'material-ui/Typography';
import Card, {CardActions, CardHeader, CardContent, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import DIcon from '../../icons';
import {getImgSrc} from '../../utils';

@inject('store')
export default class MappingCard extends Component {

  static propTypes = {
    mapping : PropTypes.object
  };

  goToMapping = (ev) => {
    const {store, mapping} = this.props;
    store.goTo('campaign', {username: mapping.user.username, slug: mapping.slug })
  }

  render() {
    const m = this.props.mapping;
    const title = !!m.tag ? '#'+m.tag : m.name;
    const subtitle = (!!m.name ? '#'+m.main_tag.tag : '')+', '+m.dateo_count+' dateos';
    let img;
    if (!!m.tag) {
      img = <div className="mapping-card-img-icon hashtag"><DIcon name="pound" /></div>;
    } else {
      if (m.image && m.image.image) {
        img = <div className="mapping-card-img" style={{backgroundImage: 'url('+getImgSrc(m.image.image)+')'}} />;
      }else{
        img = <div className="mapping-card-img-icon campaign"><DIcon name="map-marker-multiple" /></div>
      }
    }

    return (
      <Card onClick={this.goToMapping}>
        {img}
        <CardContent>
          <Typography variant="headline" component="h3">{title}</Typography>
          <Typography variant="subheading" component="p">{subtitle}</Typography>
        </CardContent>
      </Card>
    )
  }
}
