import React from 'react';
import UI from '../../../stores/ui';
import USER from '../../../stores/user';
import RaisedButton from 'material-ui/RaisedButton';
import {t, translatable} from '../../../i18n';
import {observer} from 'mobx-react';
import AccountFormContainer from '../account-form-container';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import DIcon from '../../../icons';
import {Link} from 'react-router';
import './recover-password.scss';

@translatable
@observer
export default class RecoverPasswordPage extends React.Component {

  static contextTypes = {
    router : React.PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit : false
    };
  }

  componentDidMount() {
    if (USER.isSignedIn) this.context.router.push('/');
  }

  blurTextInputs = () => {
    document.querySelector('.email-field input').blur();
  }

  render() {
    return (
      <AccountFormContainer className="recover-password-page">
        <div className="account-form-header with-icon">
          <DIcon name="daterito6" />
          <h3 className="title">{t('RECOVER_PASSWORD.PAGE_TITLE')}</h3>
        </div>
        <div className="recover-password-content">
          <div className="info-text">{t('RECOVER_PASSWORD.INFO_TEXT')}</div>
          <Formsy.Form ref="registerForm"
            onValid={this.onFormValid}
            onInvalid={this.disableSubmit}
            onValidSubmit={this.submit}
            onInvalidSubmit={this.notifyFormError} >

            <div className="input-row">
              <FormsyText
                name="email"
                required
                className="email-field"
                floatingLabelText={t('LOGIN_PAGE.EMAIL_PH')}
                validations="isEmail"
                validationErrors={{isEmail : t('ACCOUNT_MSG.EMAIL_INVALID')}}
                />
            </div>

            <div className="form-btns">
              <RaisedButton
                onMouseEnter={this.blurTextInputs}
                primary={true}
                type="submit"
                label={t('SUBMIT')}
                disabled={!this.state.canSubmit}
              />
            </div>

          </Formsy.Form>
        </div>
      </AccountFormContainer>
    )
  }
}
