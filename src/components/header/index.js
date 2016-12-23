import './header.scss';
import React from 'react';
import UI from '../../stores/ui';
import {observer} from 'mobx-react';
import config from '../../config';
import MobileHeader from './mobile';
import NormalHeader from './normal';

@observer
export default class Header extends React.Component {

  render() {
    if (UI.isMobile) return <MobileHeader />
    return <NormalHeader />
  }
}
