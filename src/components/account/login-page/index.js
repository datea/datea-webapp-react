import React from 'react';
import Paper from 'material-ui/Paper';
import USER from '../../../stores/user';
import RaisedButton from 'material-ui/RaisedButton';
import {t, translatable} from '../../../i18n';
import {observer} from 'mobx-react';
import LoginForm from '../login-form';
import FbIcon from 'material-ui-community-icons/icons/facebook';
import TwIcon from 'material-ui-community-icons/icons/twitter';
import '../account.scss';
import AccountFormContainer from '../account-form-container';

@translatable
@observer
export default class LoginPage extends React.Component {

  loginWithFB = () => USER.socialSignIn('facebook');
  loginWithTW = () => USER.socialSignIn('twitter');

  render() {
    return (
      <AccountFormContainer>
        <div className="login-page-content">
          <div className="btn-row">
            <RaisedButton
              label={t('LOGIN_PAGE.LOGIN_FB_BTN')}
              icon={<FbIcon />}
              className="social-login-btn"
              onTouchTap={this.loginWithFB}
            />
          </div>
          <div className="btn-row">
            <RaisedButton
              label={t('LOGIN_PAGE.LOGIN_TW_BTN')}
              icon={<TwIcon />}
              className="social-login-btn"
              onTouchTap={this.loginWithTW}
            />
          </div>

          <LoginForm />

        </div>
      </AccountFormContainer>
    )
  }
}
