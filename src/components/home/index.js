import './home.scss';
import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {getImgSrc} from '../../utils';
import {observer, inject} from 'mobx-react';
import MappingColumnLayout from '../mapping-column-layout';
import TestDateo from '../dateo/test-dateo';
import MapStore from '../../state/stores/map';
import DateaResizableMap from '../map';
import MappingLayout from '../mapping-layout';
import RaisedButton from 'material-ui/RaisedButton';

@inject('store')
@observer
export default class HomePage extends React.Component {

  constructor(props, context) {
    super(props, context);
    const {user, data} = this.props.store;
    this.mapStore = new MapStore(user, data);
    this.state = {
      layout: 'content'
    }
  }

  componentDidMount() {
    const {data} = this.props.store;
    //data.setMappingQuery({followed_by_tags: this.props.store.user.data.id});
    //data.getMappingDetail(49);
    //data.setDateoQuery({tags: 'Dateoacoso'})
  }

  render() {
    return (
      <MappingLayout
        mode={this.state.layout}
        visualPane={<DateaResizableMap mapStore={this.mapStore} />}
        onOpenVisualClick={() => this.setState({layout:'visual'})}
        contentBar={
          <div>
            <RaisedButton onTouchTap={() => this.setState({layout: this.state.layout == 'visual' ? 'content' : 'visual'})} >toggle state</RaisedButton>
          </div>
        }
        contentPane={
          <div>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
            <p>content here</p>
          </div>
        }
      />
    )
  }


  /*render() {
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
  }*/
}
