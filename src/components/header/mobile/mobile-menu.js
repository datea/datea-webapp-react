import React from 'react';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../../i18n';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import DirectionsRunIcon from 'material-ui/svg-icons/maps/directions-run';
import PersonIcon from 'material-ui/svg-icons/social/person';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import DefaultAvatar from '../../misc/default-avatar';
import HomeIcon from 'material-ui/svg-icons/action/home';
import SearchIcon from 'material-ui/svg-icons/action/search';
import InfoOutlineIcon from 'material-ui/svg-icons/action/info-outline';
import HelpOutlineIcon from 'material-ui/svg-icons/action/help-outline';
import LangSelectMenuItem from '../common/lang-select-menu-item';
import config from '../../../config';

@inject('store')
@translatable
@observer
export default class MobileMenu extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  goTo = (path) => {
    this.props.onRequestChange();
    this.props.history.push(path);
  }

  logout = () => {
    const {store} = this.props;
    this.props.onRequestChange();
    store.user.signOut();
    setTimeout(() => store.goTo('welcome'));
  }

  render() {
    const {user, ui, router, goTo} = this.props.store;
    return (
        <Drawer docked={false}
          open={this.props.open}
          openSecondary={router.currentView.name == 'welcome' || !user.isSignedIn ? false : true}
          className="user-drawer"
          onRequestChange={this.props.onRequestChange}>

              { user.isSignedIn &&
              <div className="profile-menu-avatar">
                {!!user.image ? <Avatar src={user.largeImage} size={100} /> : <DefaultAvatar size={100} />}
              </div> }

              <MenuItem primaryText={t('MENU_TOP.HOME')} leftIcon={<HomeIcon/>}
               onTouchTap={() => goTo('home')}
               />

             { user.isSignedIn &&
              <MenuItem primaryText={t('USER_MENU.GOTO_PROFILE')} leftIcon={<PersonIcon />}
               onTouchTap={() => {console.log('hey hey');goTo('profile', {username: user.username})}}
               />
              }

              <MenuItem primaryText={t('MENU_TOP.ABOUT')} leftIcon={<InfoOutlineIcon/>}
               onTouchTap={() => goTo('about')}
               />

              <LangSelectMenuItem mobile={true} />

              { user.isSignedIn &&
              <span>
                <Divider />
                <MenuItem primaryText={t('USER_MENU.CONFIG')} leftIcon={<SettingsIcon />}
                 onTouchTap={() => goTo('settings')}
                 />
                <MenuItem primaryText={t('USER_MENU.LOGOUT')} leftIcon={<DirectionsRunIcon />}
                 onTouchTap={this.logout}
                 />
              </span> }

        </Drawer>
      )
    }
}
