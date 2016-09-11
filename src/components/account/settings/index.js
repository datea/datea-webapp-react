import React from 'react';
import USER from '../../../stores/user';
import UI from '../../../stores/ui';
import RaisedButton from 'material-ui/RaisedButton';
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

  render() {

    const tabBtnStyle = {fontSize : UI.isMobile ? '0.75rem' : '0.9rem'};

    return (
      <div>
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
