import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Link from '../../link';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../../i18n';
import FbIcon from 'material-ui-community-icons/icons/facebook';
import TwIcon from 'material-ui-community-icons/icons/twitter';
import DateroIcon from '../../../theme/datero-caminando';
import DIcon from '../../../icons';
import AccountFormContainer from '../account-form-container';
import './register-page.scss';

@inject('store')
@translatable
@observer
export default class RegisterPage extends React.Component {

  // TODO: put this logic into stores
  socialLogin = (party) => USER.socialSignIn(party)
    .then(res => {
      const {store} = this.props;
      if (!store.user.isNew) {
        const {view, params, queryParams} = store.user.lastLoggedOutView;
        store.goTo(view, params, queryParams);
      }else{
        store.goTo('settings' ,{page: 'welcome'});
      }
    })
    .catch(err => console.log('err', err))

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
          <div className="btn-row">
            <RaisedButton
              label={t('REGISTER_PAGE.REGISTER_DATEA_BTN')}
              icon={<DateroIcon />}
              className="social-login-btn"
              onTouchTap={this.goToRegister}
            />
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
