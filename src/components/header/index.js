import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import DIcon from '../../icons';
import DateaLogoIcon from '../../theme/datea-logo';
import UI from '../../stores/ui';
import cn from 'classnames';

import './header.scss';
//<DIcon name="datea-logo" />

export default class Header extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      openDrawer : false,
      isLoggedIn : false,
    }
  }

  toggleDrawer = () => this.setState({openDrawer: !this.state.openDrawer});
  setDrawer    = (o) => this.setState({openDrawer: o});

  render() {
    const barHeight = UI.isMobile ? 48 : 64;

    const logoSize = UI.isMobile ? 44 * 3/4 : 44;
    const logo = <IconButton
                    style={{width: logoSize+'px', height: logoSize+'px', border: 0}}
                    iconStyle={{width: logoSize+'px', height: logoSize+'px'}}
                    onTouchTap={this.toggleDrawer}>
                    <DIcon name="datea-logo" />
                </IconButton>

    const menuIconStyle = {
      width: (UI.isMobile ? 34 * 3/4 : 34)+'px',
      height: (UI.isMobile ? 34 * 3/4 : 34)+'px',
      position: 'relative',
      top: UI.isMobile ? '-3px' : '3px',
      left: '-5px'
    };
    const menuBtnStyle = {
      width: UI.isMobile ? '44px' : '48px',
      height: UI.isMobile ? '44px' : '48px'
    };
    const title = <span className="header-content">
      <IconButton
        onTouchTap={this.toggleDrawer}
        style={menuBtnStyle}
        iconStyle={menuIconStyle}>
        <MenuIcon  />
      </IconButton>
    </span>

    return (
      <div className={cn('header', UI.isMobile && 'mobile')}>
        <AppBar title={title}
          iconElementLeft={logo}
          style={{height: barHeight+'px'}}/>
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
