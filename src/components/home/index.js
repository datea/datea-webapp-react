import './home.scss';
import React from 'react';
import DATA from '../../stores/data';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {getImgSrc} from '../../utils';
import {observer} from 'mobx-react';
import MappingColumnLayout from '../mapping-column-layout';
import {withRouter} from 'react-router';

@withRouter
@observer
export default class HomePage extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    DATA.getUserMappings();
  }

  componentDidUpdate() {
    //DATA.getUserMappings();
  }

  render() {
    return (
      <div className="home-page-container">

        <div className="my-mappings mapping-column-container">
          <h3>MIS MAPEOS</h3>
          <div className="mapping-row">
            <MappingColumnLayout items={DATA.userMappings} />
          </div>
        </div>
      </div>
    )
  }
}
