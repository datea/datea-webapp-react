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
import './activation-page.scss';

@translatable
@observer
export default class ActivationPage extends React.Component {

  componentDidMount() {
    if (USER.isSignedIn) this.props.history.push('/');
  }

  render() {
    const success = this.props.params.outcome == 'success';
    const icon    = success ? 'daterito1' : 'daterito6';
    const msg     = success ? 'COMPLETE' : 'ERROR';
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
              <LoginForm onSuccess={() => this.props.history.push('/settings/welcome')} />

              <div className="bottom-info">
                <div className="info-line">
                  <Link to="recover-password">{t('LOGIN_PAGE.RECOVER_PASS_LINK')}</Link>
                </div>
              </div>
            </div>
          }
          {!success &&
            <div className="form-btns">
              <RaisedButton primary={true}
                onTouchTap={() => this.props.history.push('/signin')}
                label={t('REGISTER')}
                />
            </div>
          }
        </div>
      </AccountFormContainer>
    )
  }
}
