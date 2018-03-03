import './login-page.scss';
import React from 'react';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import {t, translatable} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import LoginForm from '../login-form';
import FbIcon from 'material-ui-community-icons/icons/facebook';
import TwIcon from 'material-ui-community-icons/icons/twitter';
import AccountFormContainer from '../account-form-container';
import DIcon from '../../../icons';
import Link from '../../link';
import TwitterLoginButton from '../twitter-login-button';
import FacebookLoginButton from '../facebook-login-button';

@inject('store')
@translatable
@observer
export default class LoginPage extends React.Component {

  render() {
    return (
      <AccountFormContainer className="login-page">
        <div className="account-form-header with-icon">
          <DIcon name="daterito1" />
          <h3 className="title">{t('LOGIN_PAGE.WELCOME')}</h3>
        </div>
        <div className="login-page-content">

          <div className="btn-row">
            <FacebookLoginButton />
          </div>

          <div className="btn-row">
            <TwitterLoginButton />
          </div>

          <div className="login-form-title">{t('LOGIN_PAGE.LOGIN_DATEA_TITLE')}</div>

          <LoginForm />

          <div className="bottom-info">
            <div className="info-line">
              <Link view="register">{t('LOGIN_PAGE.NOT_A_DATERO')}</Link>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link view="recoverPass">{t('LOGIN_PAGE.RECOVER_PASS_LINK')}</Link>
            </div>
          </div>
        </div>
      </AccountFormContainer>
    )
  }
}
