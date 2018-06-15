import React from 'react';
import IconButton from 'material-ui/IconButton';
import {observer, inject} from 'mobx-react';
import MenuIcon from 'material-ui-icons/Menu';

@inject('store')
@observer
export default class MenuBtn extends React.Component {

  render() {
    const {store, ...otherProps} = this.props;
    const {ui} = store;
    const menuIconStyle = {
      width: (ui.isMobile ? 40 * 3/4 : 40)+'px',
      height: (ui.isMobile ? 40 * 3/4 : 40)+'px',
      //position: 'relative',
      //top: ui.isMobile ? '-3px' : '3px',
      //left: '-5px'
    };
    const menuBtnStyle = {
      width: ui.isMobile ? '44px' : '48px',
      height: ui.isMobile ? '44px' : '48px'
    };
    return (
      <IconButton
        className="main-menu landing-menu-button"
        {...otherProps}
        style={menuBtnStyle}>
        <MenuIcon style={menuIconStyle} />
      </IconButton>
    );
  }
}
