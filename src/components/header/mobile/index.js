import './header-mobile.scss';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import cn from 'classnames';
import AppBarLogo from '../common/app-bar-logo';
import LandingMenuBtn from '../common/menu-button';
import MobileMenu from './mobile-menu';
import {observer, inject} from 'mobx-react';
import config from '../../../config';
import MobileMenuBtn from './mobile-menu-btn';
import BackBtn from './back-btn';
import SearchBar from '../../search-bar';

const barHeight = 48;

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
    const {store: {user, ui}} = this.props;
    let headerLeft;
    if (user.isSignedIn) {
      headerLeft = ui.isHome ? <AppBarLogo onTouchTap={this.goHome} /> : <BackBtn />;
    }else{
      headerLeft = ui.isLanding ? <LandingMenuBtn onTouchTap={this.toggleMenu} /> : <AppBarLogo onTouchTap={this.goHome} />;
    }

    const headerMain = <SearchBar />;
    const headerRight = <MobileMenuBtn onTouchTap={this.toggleMenu} />;

    return (
      <div className="header mobile">
        <AppBar title={headerMain}
          iconElementLeft={headerLeft}
          iconStyleLeft={{marginTop: !user.isSignedIn && ui.isLanding ? 3 : 0}}
          style={{height: barHeight}}
          iconElementRight={headerRight}
          iconStyleRight={{marginTop: 0}}
          titleStyle={{marginTop: 0, height: barHeight, lineHeight: barHeight+'px'}}
          />
        <MobileMenu open={this.state.openMenu} onRequestChange={this.toggleMenu} />
      </div>
    )
  }
}
