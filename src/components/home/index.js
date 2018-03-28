import './home.scss';
import React from 'react';
import {observer, inject} from 'mobx-react';
import MappingColumnLayout from '../mapping-column-layout';
import Button from 'material-ui/Button';

@inject('store')
@observer
export default class HomePage extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    console.log(this.props.store.user.data);
    return (
      <div className="home-page-container">
        <div className="my-mappings mapping-column-container">
          <h3>MIS MAPEOS</h3>
          <div className="mapping-row">
            <Button variant="raised"
              onClick={() => this.props.store.goTo('profile', {username: this.props.store.user.data.username})}
            >IR A MI PERFIL</Button>
          </div>
        </div>
      </div>
    )
  }
}
