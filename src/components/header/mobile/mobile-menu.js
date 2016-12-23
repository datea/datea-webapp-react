import React from 'react';
import UI from '../../../stores/ui';
import USER from '../../../stores/user';
import {observer} from 'mobx-react';
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

@translatable
@observer
export default class MobileMenu extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
  }

  goTo = (path) => {
    this.props.onRequestChange();
    this.context.router.push(path);
  }
  logout = () => {
    this.props.onRequestChange();
    USER.signOut();
    setTimeout(() => this.context.router.push('/'+config.landingPath));
  }

  render() {
    return (
        <Drawer docked={false}
          open={this.props.open}
          openSecondary={UI.isLanding || !USER.isSignedIn ? false : true}
          className="user-drawer"
          onRequestChange={this.props.onRequestChange}>

              { USER.isSignedIn &&
              <div className="profile-menu-avatar">
                {!!USER.image ? <Avatar src={USER.largeImage} size={100} /> : <DefaultAvatar size={100} />}
              </div> }

              <MenuItem primaryText={t('MENU_TOP.HOME')} leftIcon={<HomeIcon/>}
               onTouchTap={() => this.goTo('/')}
               />

              { USER.isSignedIn &&
              <MenuItem primaryText={t('USER_MENU.GOTO_PROFILE')} leftIcon={<PersonIcon />}
               onTouchTap={() => this.goTo('/'+USER.username)}
               />
              }

              <MenuItem primaryText={t('MENU_TOP.ABOUT')} leftIcon={<InfoOutlineIcon/>}
               onTouchTap={() => this.goTo('/about')}
               />

              <LangSelectMenuItem mobile={true} />

              { USER.isSignedIn &&
              <span>
                <Divider />
                <MenuItem primaryText={t('USER_MENU.CONFIG')} leftIcon={<SettingsIcon />}
                 onTouchTap={() => this.goTo('/settings')}
                 />
                <MenuItem primaryText={t('USER_MENU.LOGOUT')} leftIcon={<DirectionsRunIcon />}
                 onTouchTap={this.logout}
                 />
              </span> }

        </Drawer>
      )
    }
}
