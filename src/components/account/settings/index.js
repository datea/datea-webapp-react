import './settings.scss';
import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import IconClose from 'material-ui-icons/Close';
import Tabs, { Tab } from 'material-ui/Tabs';
import {t, translatable} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import AccountFormContainer from '../account-form-container';
import DIcon from '../../../icons';
import SettingsIcon from 'material-ui-icons/Settings';
import config from '../../../config';
import {colors} from '../../../theme/vars';

import AccountTab from './account-tab';
import ProfileTab from './profile-tab';
import NotificationsTab from './notifications-tab';

const TABS = ['account', 'profile', 'notifications'];

@inject('store')
@translatable
@observer
export default class AccountSettings extends React.Component {

  showMessage(msgType) {
    let daterito, title, content, actions, hasClose = true;
    const {store} = this.props;
    switch (msgType) {
      case 'email-confirm':
        daterito = 'daterito2';
        title    = 'ACCOUNT_MSG.CONFIRM_TITLE';
        content  = ['ACCOUNT_MSG.CONFIRM_MISSING', 'THANK_YOU'];
        hasClose = false;
        break;
      case 'confirm-success':
        daterito = 'daterito1';
        title    = 'ACCOUNT_MSG.CONFIRM_SUCCESS_TITLE';
        content  = ['ACCOUNT_MSG.CONFIRM_SUCCESS'];
        break;
      case 'welcome':
        daterito = 'daterito3';
        title    = 'SETTINGS_PAGE.CONGRATS';
        content  = ['ACCOUNT_MSG.WELCOME_READY'];
        actions  = [
          <Button variant="raised" color="primary"
            key="next"
            onClick={() => store.router.goTo('home')}>
            {t('SETTINGS_PAGE.NEXT')}
          </Button>
        ];
        break;
      default:
        return '';
    }
    return (
      <AccountFormContainer className="settings-msg-container">
        <div className="msg-wrapper">
          {hasClose &&
            <IconButton className="close-icon"
              onClick={() => this.props.store.router.goTo('settings')}
              style={{position:'absolute', right:-15, top:-15}}>
              <IconClose />
            </IconButton>}
          <h3 className="msg-title"><DIcon name={daterito} />{t(title)}</h3>
          {content.map(c => <div key={c} className="msg-content">{t(c)}</div>)}
          {!!actions && <div className="msg-actions">{actions}</div>}
        </div>
      </AccountFormContainer>
    );
  }

  onTabChange = (ev, val) => {
    this.props.store.router.goTo('settings', {page: TABS[val]});
  }

  render() {
    const {user, ui, router} = this.props.store;
    const tabBtnStyle = {fontSize : (ui.isMobile ? '0.75rem' : '0.9rem')};
    let page = router.params && router.params.page || TABS[0];
    if (user.data.status == 0) page = 'email-confirm';

    let tab = TABS.indexOf(page);
    tab = tab < 0 ? 0 : tab;

    return (
      <div>

        {/* ACCOUNT MESSAGES */}
        {!!page && this.showMessage(page)}

        <h3 className="settings-title">
          <SettingsIcon style={{fill: '#777'}} />
          {t('SETTINGS_PAGE.TITLE')}
        </h3>
        <AccountFormContainer className="settings-form-container">
          <div className="account-settings">
            <Tabs indicatorColor="primary" value={tab} onChange={this.onTabChange} fullWidth>
              <Tab label={t('SETTINGS_PAGE.ACCOUNT_TAB')} style={tabBtnStyle} />
              <Tab label={t('SETTINGS_PAGE.PROFILE_TAB')} style={tabBtnStyle} />
              <Tab label={t('SETTINGS_PAGE.NOTIFY.TAB')} style={tabBtnStyle} />
            </Tabs>
            <div className="tab-content">
              {tab == 0 && <AccountTab />}
              {tab == 1 && <ProfileTab />}
              {tab == 2 && <NotificationsTab />}
            </div>
          </div>
        </AccountFormContainer>
      </div>
    )
  }
}
