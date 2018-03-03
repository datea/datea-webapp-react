import React from 'react';
import config from '../../../config';
import IconButton from 'material-ui/IconButton';
import {observer, inject} from 'mobx-react';
import Button from 'material-ui/Button';
import {t, translatable} from '../../../i18n';
import Drawer from 'material-ui/Drawer';
import {MenuItem, MenuList} from 'material-ui/Menu';
import {ListItemIcon, ListItemText} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import DirectionsRunIcon from 'material-ui-icons/DirectionsRun';
import PersonIcon from 'material-ui-icons/Person';
import SettingsIcon from 'material-ui-icons/Settings';
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
          <Button
            onClick={() => this.goTo(isLoginView ? 'register' : 'login')}
            style={{marginTop: ui.isMobile ? 6 : 7 }}
            className="login-btn">
            {t(isLoginView ? 'REGISTER' : 'LOGIN')}
          </Button>
        }
        {user.isSignedIn &&
          <span>
            <IconButton
              onClick={this.toggleUserDrawer}
              style={{border: 0, padding: 0}}>
              <UserAvatar src={user.image} size={this.getAvatarSize()} />
            </IconButton>
            <Drawer
              open={this.state.openDrawer}
              anchor="right"
              className="user-drawer"
              onClose={this.toggleUserDrawer}>
                  <div className="profile-menu-avatar">
                    <UserAvatar
                      src={user.largeImage}
                      size={ui.isMobile ? 100 : 120}
                    />
                  </div>
                  <MenuList>
                    <MenuItem onClick={this.goToProfile}>
                      <ListItemIcon><PersonIcon /></ListItemIcon>
                      <ListItemText primary={t('USER_MENU.GOTO_PROFILE')} />
                    </MenuItem>
                    <MenuItem onClick={this.goToSettings}>
                      <ListItemIcon><SettingsIcon /></ListItemIcon>
                      <ListItemText primary={t('USER_MENU.CONFIG')} />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={this.logout}>
                      <ListItemIcon><DirectionsRunIcon /></ListItemIcon>
                      <ListItemText primary={t('USER_MENU.LOGOUT')} />
                    </MenuItem>
                  </MenuList>
            </Drawer>
          </span>
        }
        </span>
      )
    }
}
