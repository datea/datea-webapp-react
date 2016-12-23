import './header-normal.scss';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import UI from '../../../stores/ui';
import cn from 'classnames';
import AppBarLogo from '../common/app-bar-logo';
import MenuBtn from '../common/menu-button';
import UserMenu from './user-menu';
import LangSwitcher from './lang-switcher';
import MainMenu from './main-menu';
import {observer} from 'mobx-react';
import config from '../../../config';
import SearchBar from '../../search-bar';

const barHeight = 64;

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
    this.context.router.push('/');
  }

  render() {

    const headerIcon = !UI.isLanding ? <AppBarLogo onTouchTap={this.onLogoClick} /> : <MenuBtn onTouchTap={this.toggleMainMenu} />;
    const headerMain = (
      <span className="header-content">
        {!UI.isLanding && <MenuBtn onTouchTap={this.toggleMainMenu} className="main-menu" />}
        <div className="search-container"><SearchBar /></div>
      </span>
    );
    const headerRight = (
      <span className="header-right">
        <span className="btn"><LangSwitcher/></span>
        <span className="btn"><UserMenu /></span>
      </span>
    );

    return (
      <div className="header normal">
        <AppBar title={headerMain}
          iconElementLeft={headerIcon}
          iconStyleLeft={{marginTop: 2}}
          style={{height: barHeight}}
          iconElementRight={headerRight}
          iconStyleRight={{marginTop: 8}}
          titleStyle={{overflow: 'visible'}}
          />
        <MainMenu open={this.state.openMainMenu}
          onRequestChange={this.toggleMainMenu}
          />
      </div>
    )
  }
}
