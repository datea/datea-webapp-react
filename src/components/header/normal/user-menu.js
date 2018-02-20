import React from 'react';
import config from '../../../config';
import IconButton from 'material-ui/IconButton';
import {observer, inject} from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import {t, translatable} from '../../../i18n';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import DirectionsRunIcon from 'material-ui/svg-icons/maps/directions-run';
import PersonIcon from 'material-ui/svg-icons/social/person';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import DefaultAvatar from '../../misc/default-avatar';
import UserAvatar from '../../user-avatar';


@inject('store')
@translatable
@observer
export default class UserMenu extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      openDrawer : false
    }
  }

  toggleUserDrawer = () => this.setState({openDrawer: !this.state.openDrawer});
  closeDrawer =() => this.setState({openDrawer: false});
  goTo = (...args) => this.props.store.goTo(...args);
  goToSettings = () => {
    this.closeDrawer();
    this.props.store.goTo('settings');
  }
  goToProfile = () => {
    this.closeDrawer();
    this.props.store.goTo('profile', {username: this.props.store.user.data.username});
  }
  logout = () => {
    const {store} = this.props;
    store.user.signOut();
    setTimeout(() => store.goTo('welcome'));
    this.closeDrawer();
  }

  getAvatarSize() {
    return this.props.store.ui.isMobile ? 36:44;
  }

  render() {
    const {user, ui, router} = this.props.store;
    const isLoginView = !!router && router.currentView && router.currentView.name == 'login';
    return (
      <span className="user-menu">
        {!user.isSignedIn &&
          <FlatButton
            label={t(isLoginView ? 'REGISTER' : 'LOGIN')}
            onTouchTap={() => this.goTo(isLoginView ? 'register' : 'login')}
            labelStyle={{
              fontSize: '1rem',

              paddingRight: ui.isMobile ? 6 : 16,
              paddingLeft: ui.isMobile ? 6 : 16
            }}
            style={{marginTop: ui.isMobile ? 6 : 7 }}
            className="login-btn"
            />
        }
        {user.isSignedIn &&
          <span>
            <IconButton
              onTouchTap={this.toggleUserDrawer}
              style={{border: 0, padding: 0}}>
              <UserAvatar src={user.image} size={this.getAvatarSize()} />
            </IconButton>
            <Drawer
              docked={false}
              open={this.state.openDrawer}
              openSecondary={true}
              className="user-drawer"
              onRequestChange={this.toggleUserDrawer}>
                  <div className="profile-menu-avatar">
                    <UserAvatar
                      src={user.largeImage}
                      size={ui.isMobile ? 100 : 120}
                    />
                  </div>
                  <MenuItem onTouchTap={this.goToProfile}
                    leftIcon={<PersonIcon />}>
                    {t('USER_MENU.GOTO_PROFILE')}
                  </MenuItem>
                  <MenuItem onTouchTap={this.goToSettings}
                    leftIcon={<SettingsIcon />}>
                    {t('USER_MENU.CONFIG')}
                  </MenuItem>
                  <Divider />
                  <MenuItem onTouchTap={this.logout}
                    leftIcon={<DirectionsRunIcon />}
                    >
                    {t('USER_MENU.LOGOUT')}
                  </MenuItem>
            </Drawer>
          </span>
        }
        </span>
      )
    }
}
