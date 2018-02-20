import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import {t, translatable} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import HomeIcon from 'material-ui/svg-icons/action/home';
import SearchIcon from 'material-ui/svg-icons/action/search';
import InfoOutlineIcon from 'material-ui/svg-icons/action/info-outline';
import HelpOutlineIcon from 'material-ui/svg-icons/action/help-outline';
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

  render() {
    return (
      <Drawer docked={false}
        open={this.props.open}
        onRequestChange={this.props.onRequestChange}>
          <Subheader>{t('MENU_TOP.MENU')}</Subheader>
          <MenuItem primaryText={t('MENU_TOP.HOME')} rightIcon={<HomeIcon/>} />
          <MenuItem primaryText={t('MENU_TOP.ABOUT')} rightIcon={<InfoOutlineIcon/>} />
          <MenuItem primaryText={t('MENU_TOP.HELP')} rightIcon={<HelpOutlineIcon/>} />
          <br /><br />
          <Divider />
          <Subheader>{t('MENU_TOP.LANGUAGE')}</Subheader>
          <LangSelectMenuItem mobile={false} />
      </Drawer>
    )
  }
}
