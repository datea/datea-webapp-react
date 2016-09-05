import React from 'react';
import AppBar from 'material-ui/AppBar';
import UI from '../../stores/ui';
import cn from 'classnames';
import AppBarLogo from './app-bar-logo';
import MenuBtn from './menu-button';
import UserMenu from './user-menu';
import LangSwitcher from './lang-switcher';
import MainMenu from './main-menu';
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
      openMainMenu : false
    }
  }

  toggleMainMenu = () => this.setState({openMainMenu: !this.state.openMainMenu});
  setDrawer    = (o) => this.setState({openMainMenu: o});
  onLogoClick  = (ev) => {
    if (UI.isMobile) {
      this.toggleMainMenu();
    }else{
      this.context.router.push('/');
    }
  }

  render() {
    const barHeight = UI.isMobile ? 48 : 64;

    const headerMain = (
      <span className="header-content">
        {!UI.isMobile && <MenuBtn onTouchTap={this.toggleMainMenu} />}
      </span>
    );
    const headerRight = (
      <span className="header-right">
        <span className="btn"><LangSwitcher/></span>
        <span className="btn"><UserMenu /></span>
      </span>
    );

    return (
      <div className={cn('header', UI.isMobile && 'mobile')}>
        <AppBar title={headerMain}
          iconElementLeft={<AppBarLogo onTouchTap={this.onLogoClick} />}
          style={{height: barHeight+'px'}}
          iconElementRight={headerRight}
          iconStyleRight={{marginTop: UI.isMobile ? 0 : 8}}
          />
        <MainMenu open={this.state.openMainMenu}
          onRequestChange={this.toggleMainMenu}
          />
      </div>
    )
  }
}
