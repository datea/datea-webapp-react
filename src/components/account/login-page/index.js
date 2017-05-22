import React from 'react';
import Paper from 'material-ui/Paper';
import UI from '../../../stores/ui';
import USER from '../../../stores/user';
import RaisedButton from 'material-ui/RaisedButton';
import {t, translatable} from '../../../i18n';
import {observer} from 'mobx-react';
import LoginForm from '../login-form';
import FbIcon from 'material-ui-community-icons/icons/facebook';
import TwIcon from 'material-ui-community-icons/icons/twitter';
import AccountFormContainer from '../account-form-container';
import DIcon from '../../../icons';
import {Link} from 'react-router-dom';
import './login-page.scss';

@translatable
@observer
export default class LoginPage extends React.Component {

  componentDidMount() {
    if (USER.isSignedIn) this.props.history.push('/');
  }

  socialLogin = (party) => USER.socialSignIn(party)
    .then(res => this.props.history.push(USER.isNew ? '/settings/welcome' : UI.lastLoggedOutURL))
    .catch(err => console.log('err', err))

  render() {
    return (
      <AccountFormContainer className="login-page">
        <div className="account-form-header with-icon">
          <DIcon name="daterito1" />
          <h3 className="title">{t('LOGIN_PAGE.WELCOME')}</h3>
        </div>
        <div className="login-page-content">
          <div className="btn-row">
            <RaisedButton
              label={t('LOGIN_PAGE.LOGIN_FB_BTN')}
              icon={<FbIcon />}
              className="social-login-btn"
              onTouchTap={() => this.socialLogin('facebook')}
            />
          </div>

          <div className="btn-row">
            <RaisedButton
              label={t('LOGIN_PAGE.LOGIN_TW_BTN')}
              icon={<TwIcon />}
              className="social-login-btn"
              onTouchTap={() => this.socialLogin('twitter')}
            />
          </div>

          <div className="login-form-title">{t('LOGIN_PAGE.LOGIN_DATEA_TITLE')}</div>

          <LoginForm />

          <div className="bottom-info">
            <div className="info-line">
              <Link to="/signup">{t('LOGIN_PAGE.NOT_A_DATERO')}</Link>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link to="recover-password">{t('LOGIN_PAGE.RECOVER_PASS_LINK')}</Link>
            </div>
          </div>
        </div>
      </AccountFormContainer>
    )
  }
}
