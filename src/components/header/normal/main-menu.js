import React from 'react';
import Drawer from 'material-ui/Drawer';
import {MenuItem, MenuList} from 'material-ui/Menu';
import {ListItemIcon, ListItemText, ListSubheader} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {t, translatable} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import HomeIcon from 'material-ui-icons/Home';
import SearchIcon from 'material-ui-icons/Search';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import HelpOutlineIcon from 'material-ui-icons/HelpOutline';
import LangSelectMenuItem from '../common/lang-select-menu-item';

const langs = {
  'es' : 'Español',
  'fr' : 'Français'
}

@inject('store')
@translatable
@observer
export default class MainMenu extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  onLocaleChange = (event, index, value) => this.props.store.user.setLocale(value);

  goTo = (view, params) => {
    this.props.onClose();
    this.props.store.router.goTo(view, params);
  }

  render() {
    return (
      <Drawer
        open={this.props.open}
        onClose={this.props.onClose}>
          <MenuList className="main-menu-list">
            <ListSubheader>{t('MENU_TOP.MENU')}</ListSubheader>
            <MenuItem onClick={() => this.goTo('home')}>
              <ListItemText primary={t('MENU_TOP.HOME')} />
              <ListItemIcon><HomeIcon/></ListItemIcon>
            </MenuItem>
            <MenuItem onClick={() => this.goTo('info', {pageId : 'about'})}>
              <ListItemText primary={t('MENU_TOP.ABOUT')} />
              <ListItemIcon><InfoOutlineIcon/></ListItemIcon>
            </MenuItem>
            <br /><br />
            <Divider />
            <ListSubheader>{t('MENU_TOP.LANGUAGE')}</ListSubheader>
            <LangSelectMenuItem />
          </MenuList>
      </Drawer>
    )
  }
}
