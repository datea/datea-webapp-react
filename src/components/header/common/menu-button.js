import React from 'react';
import UI from '../../../stores/ui';
import IconButton from 'material-ui/IconButton';
import {observer} from 'mobx-react';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

@observer
export default class MenuBtn extends React.Component {

  render() {
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
    return <IconButton
      {...this.props}
      style={menuBtnStyle}
      iconStyle={menuIconStyle}>
      <MenuIcon  />
    </IconButton>
  }
}
