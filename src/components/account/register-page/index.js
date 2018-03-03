import './register-page.scss';
import React from 'react';
import {observer, inject} from 'mobx-react';
import Button from 'material-ui/Button';
import Link from '../../link';
import {t, translatable} from '../../../i18n';
import TwitterLoginButton from '../twitter-login-button';
import FacebookLoginButton from '../facebook-login-button';
import DateroIcon from '../../../theme/datero-caminando';
import DIcon from '../../../icons';
import AccountFormContainer from '../account-form-container';

@inject('store')
@translatable
@observer
export default class RegisterPage extends React.Component {

  goToRegister = () => {
    this.props.store.goTo('registerFormPage');
  }

  render() {
    return (
      <AccountFormContainer className="register-page">
        <div className="account-form-header with-icon">
          <DIcon name="daterito1" />
          <h3 className="title">{t('REGISTER_PAGE.WELCOME')}</h3>
          <div className="subtitle">{t('REGISTER_PAGE.PAGE_DESC')}</div>
        </div>
        <div className="register-page-content">
          <div className="btn-row">
            <FacebookLoginButton />
          </div>
          <div className="btn-row">
            <TwitterLoginButton />
          </div>
          <div className="btn-row">
            <Button variant="raised"
              className="social-login-btn"
              onClick={this.goToRegister}
            ><DateroIcon className="d-icon" />{t('REGISTER_PAGE.REGISTER_DATEA_BTN')}</Button>
          </div>
          <div className="bottom-info">
            <div className="info-line">{t('REGISTER_PAGE.NOT_WITHOUT_CONSENT')}</div>
            <div className="info-line"><Link view="privacidad">{(t('MENU_FOOTER.PRIVACY'))}</Link></div>
          </div>
        </div>
      </AccountFormContainer>
    )
  }
}
