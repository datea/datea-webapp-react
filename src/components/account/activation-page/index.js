import './activation-page.scss';
import React from 'react';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import {t, translatable} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import Link from '../../link';
import LoginForm from '../login-form';
import FbIcon from 'material-ui-community-icons/icons/facebook';
import TwIcon from 'material-ui-community-icons/icons/twitter';
import AccountFormContainer from '../account-form-container';
import DIcon from '../../../icons';


@inject('store')
@translatable
@observer
export default class ActivationPage extends React.Component {

  render() {
    const success = this.props.params.outcome == 'success';
    const icon    = success ? 'daterito1' : 'daterito6';
    const msg     = success ? 'COMPLETE' : 'ERROR';
    const {store} = this.props;
    return (
      <AccountFormContainer className="login-page">
        <div className="account-form-header with-icon">
          <DIcon name={icon} />
          <h3 className="title">{t('ACCOUNT_MSG.ACTIVATION_'+msg+'_TITLE')}</h3>
        </div>
        <div className="activation-page-content">
          <div className="info-text">{t('ACCOUNT_MSG.ACTIVATION_'+msg)}</div>

          {success &&
            <div>
              <LoginForm onSuccess={() => store.goTo('settings', {page: 'welcome'})} />

              <div className="bottom-info">
                <div className="info-line">
                  <Link view="recover-password">{t('LOGIN_PAGE.RECOVER_PASS_LINK')}</Link>
                </div>
              </div>
            </div>
          }
          {!success &&
            <div className="form-btns">
              <Button variant="raised"  color="primary"
                onClick={() => store.goTo('register')}
                >label={t('REGISTER')}</Button>
            </div>
          }
        </div>
      </AccountFormContainer>
    )
  }
}
