import './header.scss';
import React from 'react';
import {observer, inject} from 'mobx-react';
import config from '../../config';
import MobileHeader from './mobile';
import NormalHeader from './normal';

@inject('store')
@observer
export default class Header extends React.Component {

  render() {
    const {ui} = this.props.store;
    if (ui.isMobile) return <MobileHeader />
    return <NormalHeader />
  }
}
