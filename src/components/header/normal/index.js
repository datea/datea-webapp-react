import './header-normal.scss';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import DateaAppBar from '../../app-bar';
import Typography from 'material-ui/Typography';
import cn from 'classnames';
import AppBarLogo from '../common/app-bar-logo';
import MenuBtn from '../common/menu-button';
import UserMenu from './user-menu';
import LangSwitcher from './lang-switcher';
import MainMenu from './main-menu';
import {observer, inject} from 'mobx-react';
import config from '../../../config';
import SearchBar from '../../search-bar2';
import {colors} from '../../../theme/vars';

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
    return (
      <div className="header normal">
        <DateaAppBar position="fixed" colorName={ui.isLanding ? 'yellow': 'white'}>
          <div className="header-content">
            <div className="header-left">
              {!ui.isLanding && <AppBarLogo onClick={this.onLogoClick} />}
              <MenuBtn onClick={this.toggleMainMenu} />
            </div>
            <div className="header-center">
              <div className="search-container">
                <SearchBar />
              </div>
            </div>
            <div className="header-right">
              <span className="btn"><LangSwitcher/></span>
              <span className="btn"><UserMenu /></span>
            </div>
          </div>
        </DateaAppBar>
        <MainMenu open={this.state.openMainMenu}
          onClose={this.toggleMainMenu}
          />
      </div>
    )
  }
}
