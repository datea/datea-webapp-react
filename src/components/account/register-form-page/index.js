import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import {observer} from 'mobx-react';
import {t, translatable} from '../../../i18n';
import USER from '../../../stores/user';
import DateroIcon from '../../../theme/datero-caminando';
import AccountFormContainer from '../account-form-container';
import {emailExists, usernameExists} from '../../../utils';
import validations from 'formsy-react/src/validationRules';
import config from '../../../config';
import DIcon from '../../../icons';
import './register-form-page.scss';

const minUnameL = config.validation.username.minLength;
const maxUnameL = config.validation.username.maxLength;

@translatable
@observer
export default class RegisterFormPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit : false,
      success   : false,
      error     : false
    }
  }

  componentDidMount() {
    if (USER.isSignedIn) this.props.history.push('/');
  }

  /* EVENT HANDLERS */
  enableSubmit = () => this.setState({canSubmit: true});
  disableSubmit = () => this.setState({canSubmit: false});
  notifyFormError = (e) => console.log('form error', e);
  resetError = () => this.setState({error: false});

  blurTextInputs = () => {
    document.querySelector('.password-confirm-field input').blur();
    document.querySelector('.password-field input').blur();
    document.querySelector('.username-field input').blur();
    document.querySelector('.email-field input').blur();
  }

  validateEmailOnServer = (ev) => {
    const mail = ev.currentTarget.value;
    if (validations.isEmail([], mail)) {
      emailExists(mail)
      .then(res => {
        res.body.result && this.refs.registerForm.updateInputsWithError({
          email : t('ACCOUNT_MSG.EMAIL_EXISTS')
        });
      });
    }
  }

  validateUsernameOnServer = (ev) => {
    const uname = ev.currentTarget.value;
    if (validations.isAlphanumeric([], uname) && uname.length >= minUnameL && uname.length < maxUnameL) {
      usernameExists(uname)
      .then(res => {
        res.body.result && this.refs.registerForm.updateInputsWithError({
          username : t('ACCOUNT_MSG.DUPLICATE_USER')
        });
      });
    }
  }

  submit = () => USER.register(this.refs.registerForm.getModel())
    .then(res => this.setState({success: true}))
    .catch(err => this.setState({error: t('ERROR.UNKNOWN')}))


  render() {
    return (
      <AccountFormContainer className="register-form-page">
        {!this.state.success &&
          <div>
            <div className="account-form-header with-icon">
              <DIcon name="daterito1" />
              <h3 className="title">{t('REGISTER_FORM_PAGE.TITLE')}</h3>
            </div>
            <div className="register-form-content">

              {!!this.state.error &&
                <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.error}}></div>
              }

              <Formsy.Form ref="registerForm"
                onValid={this.enableSubmit}
                onInvalid={this.disableSubmit}
                onValidSubmit={this.submit}
                onChange={this.resetError}
                onInvalidSubmit={this.notifyFormError} >

                <div className="input-row">
                  <FormsyText
                    name="username"
                    required
                    className="username-field"
                    onBlur={this.validateUsernameOnServer}
                    floatingLabelText={t('REGISTER_FORM_PAGE.USERNAME_LABEL')}
                    validations={'isAlphanumeric,minLength:'+minUnameL+',maxLength:'+maxUnameL}
                    validationErrors={{
                      isAlphanumeric : t('REGISTER_FORM_PAGE.USERNAME_ALPHANUM'),
                      minLength: t('REGISTER_FORM_PAGE.USERNAME_LENGTH'),
                      maxLength: t('REGISTER_FORM_PAGE.USERNAME_LENGTH'),
                    }} />
                </div>

                <div className="input-row">
                  <FormsyText
                    name="email"
                    required
                    onBlur={this.validateEmailOnServer}
                    className="email-field"
                    floatingLabelText={t('REGISTER_FORM_PAGE.EMAIL_LABEL')}
                    validations="isEmail"
                    validationErrors={{isEmail : t('ACCOUNT_MSG.EMAIL_INVALID')}}
                    />
                </div>

                <div className="input-row">
                  <FormsyText
                    name="password"
                    type="password"
                    required
                    className="password-field"
                    floatingLabelText={t('REGISTER_FORM_PAGE.PASS_LABEL')}
                    validations={{matchRegexp: config.validation.password.regex}}
                    validationErrors={{matchRegexp : t('REGISTER_FORM_PAGE.PASS_DESC')}}
                    />
                </div>

                <div className="input-row">
                  <FormsyText
                    name="passwordConfirm"
                    type="password"
                    required
                    className="password-confirm-field"
                    floatingLabelText={t('REGISTER_FORM_PAGE.REPEAT_PASS')}
                    validations="equalsField:password"
                    validationErrors={{equalsField : t('REGISTER_FORM_PAGE.PASS_REPEAT_ERROR')}}
                    />
                </div>

                <div className="form-btns">
                  <RaisedButton
                    onMouseEnter={this.blurTextInputs}
                    primary={true}
                    type="submit"
                    label={t('REGISTER')}
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
              <DIcon name="daterito1" />
              <h3 className="title">{t('REGISTER_FORM_PAGE.CONFIRM_TITLE')}</h3>
            </div>
            <div className="register-success-message">
              <div className="info-text">{t('REGISTER_FORM_PAGE.CONFIRM1')}</div>
              <div className="info-text">{t('REGISTER_FORM_PAGE.CONFIRM2')}</div>
              <div className="form-btns">
                <RaisedButton
                  primary={true}
                  onTouchTap={() => this.props.history.push('/signin')}
                  label={t('LOGIN')}
                />
              </div>
            </div>
          </div>
        }
      </AccountFormContainer>
    )
  }
}
