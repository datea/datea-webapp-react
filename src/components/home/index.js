import './home.scss';
import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {getImgSrc} from '../../utils';
import {observer, inject} from 'mobx-react';
import MappingColumnLayout from '../mapping-column-layout';
import TestDateo from '../dateo/test-dateo';
import MapStore from '../../store/stores/map';
import DateaResizableMap from '../map';

@inject('store')
@observer
export default class HomePage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.mapStore = new MapStore(this.props.store.user);
  }

  componentDidMount() {
    const {data} = this.props.store;
    data.setMappingQuery({followed_by_tags: this.props.store.user.data.id});
    data.setDateoQuery({tags: 'Redsopa'});
  }

  render() {
    return (
      <div className="home-page-container">

        <div style={{height: '300px'}}>
          <DateaResizableMap mapStore={this.mapStore} />
        </div>

        <div className="my-mappings mapping-column-container">
          <TestDateo />
          <h3>MIS MAPEOS</h3>
          <div className="mapping-row">
            <MappingColumnLayout mappings={this.props.store.data.mappings} />
          </div>
        </div>
      </div>
    )
  }
}
