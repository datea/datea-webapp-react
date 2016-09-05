import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import DIcon from '../../icons';
import DateaLogoIcon from '../../theme/datea-logo';
import UI from '../../stores/ui';
import cn from 'classnames';
import AppBarLogo from './app-bar-logo';
import MenuBtn from './menu-button';
import UserMenu from './user-menu';
import LangSwitcher from './lang-switcher';
import {observer} from 'mobx-react';

import './header.scss';

@observer
export default class Header extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      openDrawer : false,
      isLoggedIn : false,
    }
  }

  toggleDrawer = () => this.setState({openDrawer: !this.state.openDrawer});
  setDrawer    = (o) => this.setState({openDrawer: o});
  onLogoClick  = (ev) => {
    if (UI.isMobile) {
      this.toggleDrawer();
    }else{
      this.context.router.push('/');
    }
  }

  render() {
    const barHeight = UI.isMobile ? 48 : 64;

    const headerMain = (
      <span className="header-content">
        {!UI.isMobile && <MenuBtn onTouchTap={this.toggleDrawer} />}
      </span>
    );

    return (
      <div className={cn('header', UI.isMobile && 'mobile')}>
        <AppBar title={headerMain}
          iconElementLeft={<AppBarLogo onTouchTap={this.onLogoClick} />}
          style={{height: barHeight+'px'}}
          iconElementRight={<span className="header-right">
            <span className="btn"><LangSwitcher/></span>
            <span className="btn"><UserMenu /></span>
            </span>}
          iconStyleRight={{marginTop: UI.isMobile ? 0 : 8}}
          />

        <Drawer docked={false}
          open={this.state.openDrawer}
          onRequestChange={this.setDrawer}>
            <MenuItem>Inicio</MenuItem>
            <MenuItem>Buscar</MenuItem>
            <MenuItem>Iniciativas</MenuItem>
            <MenuItem>Acerca</MenuItem>
            <MenuItem>Ayuda</MenuItem>
        </Drawer>
      </div>
    )
  }
}
