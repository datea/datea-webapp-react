import React from 'react';
import UI from '../../../stores/ui';
import USER from '../../../stores/user';
import IconButton from 'material-ui/IconButton';
import {observer} from 'mobx-react';
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

@translatable
@observer
export default class UserMenu extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      openDrawer : false
    }
  }

  toggleUserDrawer = () => this.setState({openDrawer: !this.state.openDrawer});
  closeDrawer =() => this.setState({openDrawer: false});
  goToLogin = () => {
    UI.setLastLoggedOutURL();
    this.context.router.push('/signin');
  }
  goToSettings = () => {
    this.closeDrawer();
    this.context.router.push('/settings');
  }
  goToProfile = () => {
    this.closeDrawer();
    this.context.router.push('/'+USER.data.username);
  }
  logout = () => {
    USER.signOut();
    this.closeDrawer();
  }
  getAvatarSize() {
    return UI.isMobile ? 36:44;
  }

  render() {
    return (
      <span className="user-menu">
        {!USER.isSignedIn &&
          <FlatButton
            label={t('LOGIN')}
            onTouchTap={this.goToLogin}
            labelStyle={{
              fontSize: '1rem',

              paddingRight: UI.isMobile ? 6 : 16,
              paddingLeft: UI.isMobile ? 6 : 16
            }}
            style={{marginTop: UI.isMobile ? 6 : 7 }}
            className="login-btn"
            />
        }
        {USER.isSignedIn &&
          <span>
            <IconButton
              onTouchTap={this.toggleUserDrawer}
              style={{border: 0, padding: 0}}>
              {!!USER.image &&
                <Avatar
                  src={USER.image}
                  size={this.getAvatarSize()}
                />}
              {!USER.image &&
                <DefaultAvatar size={this.getAvatarSize()} />
              }
            </IconButton>
            <Drawer
              docked={false}
              open={this.state.openDrawer}
              openSecondary={true}
              className="user-drawer"
              onRequestChange={this.toggleUserDrawer}>
                  <div className="profile-menu-avatar">
                    {!!USER.image &&
                      <Avatar
                        src={USER.largeImage}
                        size={UI.isMobile ? 100 : 120}
                      />}
                    {!USER.image &&
                      <DefaultAvatar size={UI.isMobile ? 100 : 120} />}
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
