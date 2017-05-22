import React from 'react';
import USER from '../../../stores/user';
import RaisedButton from 'material-ui/RaisedButton';
import {t, translatable} from '../../../i18n';
import {observer} from 'mobx-react';
import AccountFormContainer from '../account-form-container';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import DIcon from '../../../icons';
import './recover-password.scss';

@translatable
@observer
export default class RecoverPasswordPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit : false,
      success : false,
      error : '',
      resubmitted: false
    };
    this.email = '';
  }

  enableSubmit = () => this.setState({canSubmit: true});
  disableSubmit = () => this.setState({canSubmit: false});
  blurTextInputs = () => document.querySelector('.email-field input').blur();
  getEmail = () => {
    const email = this.refs.passResetForm.getModel().email;
    this.email = email;
    return email;
  }

  submit = () => this.setState({error: false}) || USER.resetPassword(this.getEmail())
    .then(res => this.setState({success: true}))
    .catch(err => {
      switch (err.response.status) {
        case 400:
          this.setState({error: t('ACCOUNT_MSG.RESET_NOT_FOUND')})
          break;
        case 401:
          this.setState({error: t('ACCOUNT_MSG.BLOCKED')})
          break;
        case 500:
          this.setState({error: t('ERROR.UNKNOWN')})
          break;
      }
    })

  resubmit = () => this.setState({error: false}) || USER.resetPassword(this.email)
    .then(res => this.setState({resubmitted: true}))
    .catch(err => this.setState({error: t('ERROR.UNKNOWN')}))


  componentDidMount() {
    if (USER.isSignedIn) this.props.history.push('/');
  }

  render() {
    return (
      <AccountFormContainer className="recover-password-page">
        {!this.state.success &&
          <div>
            <div className="account-form-header with-icon">
              <DIcon name="daterito6" />
              <h3 className="title">{t('RECOVER_PASSWORD.PAGE_TITLE')}</h3>
            </div>
            <div className="recover-password-content">

              <div className="info-text">{t('RECOVER_PASSWORD.INFO_TEXT')}</div>

              {!!this.state.error &&
                <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.error}}></div>
              }

              <Formsy.Form ref="passResetForm"
                onValid={this.enableSubmit}
                onInvalid={this.disableSubmit}
                onValidSubmit={this.submit} >

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
          </div>
        }
        {this.state.success &&
          <div>
            <div className="account-form-header with-icon">
              <DIcon name="daterito2" />
              <h3 className="title">{t('ACCOUNT_MSG.PASS_RESET_SENT_TITLE')}</h3>
            </div>
            <div className="recover-password-content reset-success">
              <div className="info-text">{t('ACCOUNT_MSG.PASS_RESET_SENT')}</div>
              <div className="info-text">{t('ACCOUNT_MSG.CLOSE_TAB')}</div>

              <div className="form-btns">
                <RaisedButton
                  primary={true}
                  label={t('RESUBMIT')}
                  onTouchTap={this.resubmit}
                />
              </div>
              {this.state.resubmitted &&
                <div className="resubmit-success green-text">{t('ACCOUNT_MSG.PASS_RESET_RESENT')}</div>}
              {this.state.error &&
                <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.error}}></div>}
            </div>
          </div>
        }
      </AccountFormContainer>
    )
  }
}
