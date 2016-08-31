import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import {observer} from 'mobx-react';
import {t, translatable} from '../../../i18n';
import USER from '../../../stores/user';
import FbIcon from 'material-ui-community-icons/icons/facebook';
import TwIcon from 'material-ui-community-icons/icons/twitter';
import DateroIcon from '../../../theme/datero-caminando';
import AccountFormContainer from '../account-form-container';

@translatable
@observer
export default class RegisterPage extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  };

  loginWithFB = () => USER.socialSignIn('facebook');
  loginWithTW = () => USER.socialSignIn('twitter');
  goToRegister = () => {
    this.context.router.push('/register');
  }

  render() {
    return (
      <AccountFormContainer>
        <div className="register-page-content">
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
          <div className="btn-row">
            <RaisedButton
              label={t('REGISTER_PAGE.REGISTER_DATEA_BTN')}
              icon={<DateroIcon />}
              className="social-login-btn"
              onTouchTap={this.goToRegister}
            />
          </div>
        </div>
      </AccountFormContainer>
    )
  }
}
