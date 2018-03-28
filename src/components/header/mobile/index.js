import './header-mobile.scss';
import React from 'react';
import DateaAppBar from '../../app-bar';
import cn from 'classnames';
import AppBarLogo from '../common/app-bar-logo';
import LandingMenuBtn from '../common/menu-button';
import MobileMenu from './mobile-menu';
import {observer, inject} from 'mobx-react';
import config from '../../../config';
import MobileMenuBtn from './mobile-menu-btn';
import BackBtn from './back-btn';
import SearchBar from '../../search-bar';
import {colors} from '../../../theme/vars';

@inject('store')
@observer
export default class Header extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      openMenu : false
    }
  }

  toggleMenu = () => this.setState({openMenu: !this.state.openMenu});
  goHome     = () => this.props.store.goTo('home');

  render() {
    const {user, ui, router} = this.props.store;

    let headerLeft;
    if (user.isSignedIn) {
      headerLeft = ui.isHome ? <AppBarLogo onClick={this.goHome} /> : <BackBtn />;
    }else{
      headerLeft = router.currentView.name == 'welcome' ? <LandingMenuBtn onClick={this.toggleMenu} /> : <AppBarLogo onClick={this.toggleMenu} />;
    }

    return (
      <div className={cn('header mobile', user.isSignedIn ? 'signed-in' : 'signed-out')}>
        <DateaAppBar position="fixed" colorName={ui.isLanding ? 'yellow': 'white'}>
          <div className="header-content">
            <div className="header-left">
              {headerLeft}
            </div>
            <div className="header-center">
              <div className="search-container"><SearchBar /></div>
            </div>
            <div className="header-right">
              <MobileMenuBtn onClick={this.toggleMenu} />
            </div>
          </div>
        </DateaAppBar>
        <MobileMenu open={this.state.openMenu} onClose={this.toggleMenu} />
      </div>
    )
  }
}
