import React from 'react';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../../i18n';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import {MenuItem, MenuList} from 'material-ui/Menu';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import DirectionsRunIcon from 'material-ui-icons/DirectionsRun';
import PersonIcon from 'material-ui-icons/Person';
import SettingsIcon from 'material-ui-icons/Settings';
import DefaultAvatar from '../../misc/default-avatar';
import HomeIcon from 'material-ui-icons/Home';
import SearchIcon from 'material-ui-icons/Search';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import HelpOutlineIcon from 'material-ui-icons/HelpOutline';
import LangSelectMenuItem from '../common/lang-select-menu-item';
import config from '../../../config';

@inject('store')
@translatable
@observer
export default class MobileMenu extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  goTo = (view, params) => {
    this.props.onClose();
    this.props.store.goTo(view, params);
  }

  logout = () => {
    const {store} = this.props;
    this.props.onClose();
    store.user.signOut();
    setTimeout(() => store.goTo('welcome'));
  }

  render() {
    const {user, ui, router} = this.props.store;
    return (
        <Drawer
          open={this.props.open}
          anchor={(router.currentView && router.currentView.name == 'welcome') || !user.isSignedIn ? 'left' : 'right'}
          className="user-drawer"
          onClose={this.props.onClose}>

              { user.isSignedIn &&
              <div className="profile-menu-avatar" style={{width: 250}}>
                {!!user.image ? <Avatar src={user.largeImage} style={{height: 100, width: 100}} /> : <DefaultAvatar size={100} />}
              </div> }

              <MenuList>
                <MenuItem onClick={() => this.goTo('home')}>
                  <ListItemIcon><HomeIcon/></ListItemIcon>
                  <ListItemText inset primary={t('MENU_TOP.HOME')} />
                </MenuItem>

               { user.isSignedIn &&
                  <MenuItem onClick={() => this.goTo('profile', {username: user.username})}>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText inset primary={t('USER_MENU.GOTO_PROFILE')} />
                  </MenuItem>
                }

                <MenuItem onClick={() => this.goTo('about')}>
                 <ListItemIcon><InfoOutlineIcon/></ListItemIcon>
                 <ListItemText inset primary={t('MENU_TOP.ABOUT')} />
                </MenuItem>

                <LangSelectMenuItem />

                { user.isSignedIn && [
                  <Divider key="div" />,

                  <MenuItem key="settings" onClick={() => this.goTo('settings')}>
                   <ListItemIcon><SettingsIcon /></ListItemIcon>
                   <ListItemText inset primary={t('USER_MENU.CONFIG')} />
                  </MenuItem>,

                  <MenuItem key="logout" onClick={this.logout}>
                   <ListItemIcon><DirectionsRunIcon /></ListItemIcon>
                   <ListItemText inset primary={t('USER_MENU.LOGOUT')} />
                  </MenuItem>

                ]}
              </MenuList>

        </Drawer>
      )
    }
}
