import React from 'react';
import USER from '../../../stores/user';
import UI from '../../../stores/ui';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconClose from 'material-ui/svg-icons/navigation/close';
import {Tabs, Tab} from 'material-ui/Tabs';
import {t, translatable} from '../../../i18n';
import {observer} from 'mobx-react';
import AccountFormContainer from '../account-form-container';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import DIcon from '../../../icons';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import config from '../../../config';
import './settings.scss';
import {colors} from '../../../theme/vars';

import AccountTab from './account-tab';

@translatable
@observer
export default class AccountSettings extends React.Component {

  static contextTypes ={
    router : React.PropTypes.object
  };

  showMessage(msgType) {
    let daterito, title, content, actions, hasClose = true;
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
          <RaisedButton primary={true}
            label={t('SETTINGS_PAGE.NEXT')}
            onTouchTap={() => this.context.router.push('/')} />
        ];
        break;
    }
    return (
      <AccountFormContainer className="settings-msg-container">
        <div className="msg-wrapper">
          {hasClose &&
            <IconButton className="close-icon"
              onTouchTap={() => this.context.router.replace('/settings')}
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

  render() {

    const tabBtnStyle = {fontSize : UI.isMobile ? '0.75rem' : '0.9rem'};
    let msg = this.props.params.message;
    if (USER.data.status == 0) msg = 'email-confirm';

    return (
      <div>

        {/* ACCOUNT MESSAGES */}
        {!!msg && this.showMessage(msg)}

        <h3 className="settings-title">
          <SettingsIcon color="#777" />
          {t('SETTINGS_PAGE.TITLE')}
        </h3>
        <AccountFormContainer className="settings-form-container">
          <div className="account-settings">
            <Tabs inkBarStyle={{backgroundColor: colors.green}}>
              <Tab label={t('SETTINGS_PAGE.ACCOUNT_TAB')} style={tabBtnStyle}>
                <AccountTab />
              </Tab>
              <Tab label={t('SETTINGS_PAGE.PROFILE_TAB')} style={tabBtnStyle}>
                <p>BLIP</p>
              </Tab>
              <Tab label={t('SETTINGS_PAGE.NOTIFY.TAB')} style={tabBtnStyle}>
                <p>Blup</p>
              </Tab>
            </Tabs>
          </div>
        </AccountFormContainer>
      </div>
    )
  }
}
