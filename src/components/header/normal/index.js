import './header-normal.scss';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import cn from 'classnames';
import AppBarLogo from '../common/app-bar-logo';
import MenuBtn from '../common/menu-button';
import UserMenu from './user-menu';
import LangSwitcher from './lang-switcher';
import MainMenu from './main-menu';
import {observer, inject} from 'mobx-react';
import config from '../../../config';
import SearchBar from '../../search-bar';

const barHeight = 64;

@inject('store')
@observer
export default class Header extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      openMainMenu : false
    }
  }

  toggleMainMenu = () => this.setState({openMainMenu: !this.state.openMainMenu});
  setDrawer    = (o) => this.setState({openMainMenu: o});
  onLogoClick  = (ev) => {
    this.props.store.goTo('home');
  }

  render() {
    const {ui} = this.props.store;
    const headerIcon = !ui.isLanding ? <AppBarLogo onTouchTap={this.onLogoClick} /> : <MenuBtn onTouchTap={this.toggleMainMenu} />;

    const headerMain = (
      <span className="header-content">
        {!ui.isLanding && <MenuBtn onTouchTap={this.toggleMainMenu} className="main-menu" />}
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
