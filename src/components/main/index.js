import React, {Component} from 'react';
import MainLayout from '../main-layout';
import Routes from '../../Routes';
import UI from '../../stores/ui';

export default class Main extends Component {

  componentWillUpdate(nextProps, nextState) {
    nextProps.location.pathname != this.props.location.pathname && UI.onRouteChange();
  }

  render() {
    return (
      <MainLayout>
        <Routes/>
      </MainLayout>
    );
  }
}
