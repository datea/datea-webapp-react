import React from 'react';
import Button from 'material-ui/Button';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../../i18n';
import DateroIcon from '../../../theme/datero-caminando';
import AccountFormContainer from '../account-form-container';
import {emailExists, usernameExists} from '../../../utils';
import validations from 'formsy-react/lib/validationRules';
import config from '../../../config';
import DIcon from '../../../icons';
import './register-form-page.scss';

const minUnameL = config.validation.username.minLength;
const maxUnameL = config.validation.username.maxLength;

@inject('store')
@translatable
@observer
export default class RegisterFormPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit : false,
      success   : false,
      error     : false,
      user      : '',
      email     : '',
      pass      : '',
      passConfirm : ''
    }
  }

  /* EVENT HANDLERS */
  enableSubmit = () => this.setState({canSubmit: true});
  disableSubmit = () => this.setState({canSubmit: false});
  notifyFormError = (e) => console.log('form error', e);
  resetError = () => this.setState({error: false});

  // avoid autofill to hover on label
  componentDidMount() {
    setTimeout(() => {
      try {
        let newState = {};
        ['user', 'email', 'pass', 'passConfirm'].forEach(field => {
          if (this[`${field}Ref`].matches(':-webkit-autofill')) {
              newState[`${field}AF`] = true;
          }
        })
        !!Object.keys(newState).length && this.setState(newState);
      } catch (e) {}
    }, 100)
  }

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

  submit = () => this.props.store.user.register(this.refs.registerForm.getModel())
    .then(res => this.setState({success: true}))
    .catch(err => this.setState({error: t('ERROR.UNKNOWN')}))


  render() {
    const {store} = this.props;
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

              <Formsy ref="registerForm"
                onValid={this.enableSubmit}
                onInvalid={this.disableSubmit}
                onValidSubmit={this.submit}
                onChange={this.resetError}
                onInvalidSubmit={this.notifyFormError} >

                <div className="input-row">
                  <FormsyText
                    name="username"
                    required
                    fullWidth={true}
                    className="username-field"
                    inputProps={{onBlur:this.validateUsernameOnServer}}
                    label={t('REGISTER_FORM_PAGE.USERNAME_LABEL')}
                    InputLabelProps={{shrink: this.state.user || this.state.userAF}}
                    validations={'isAlphanumeric,minLength:'+minUnameL+',maxLength:'+maxUnameL}
                    inputProps={{ref : ref => {this.userRef = ref }}}
                    value={this.state.user}
                    onChange={ev => this.setState({user: event.target.value, userAF: false})}
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
                    fullWidth={true}
                    inputProps={{onBlur:this.validateEmailOnServer}}
                    className="email-field"
                    label={t('REGISTER_FORM_PAGE.EMAIL_LABEL')}
                    InputLabelProps={{shrink: this.state.email || this.state.emailAF}}
                    validations="isEmail"
                    validationErrors={{isEmail : t('ACCOUNT_MSG.EMAIL_INVALID')}}
                    inputProps={{ref : ref => {this.emailRef = ref }}}
                    value={this.state.email}
                    onChange={ev => this.setState({email: event.target.value, emailAF: false})}
                    />
                </div>

                <div className="input-row">
                  <FormsyText
                    name="password"
                    type="password"
                    required
                    fullWidth={true}
                    className="password-field"
                    label={t('REGISTER_FORM_PAGE.PASS_LABEL')}
                    InputLabelProps={{shrink: this.state.pass || this.state.passAF}}
                    validations={{matchRegexp: config.validation.password.regex}}
                    validationErrors={{matchRegexp : t('REGISTER_FORM_PAGE.PASS_DESC')}}
                    inputProps={{ref : ref => {this.passRef = ref }}}
                    value={this.state.pass}
                    onChange={ev => this.setState({pass: event.target.value, passAF: false})}
                    />
                </div>

                <div className="input-row">
                  <FormsyText
                    name="passwordConfirm"
                    type="password"
                    required
                    fullWidth={true}
                    className="password-confirm-field"
                    label={t('REGISTER_FORM_PAGE.REPEAT_PASS')}
                    InputLabelProps={{shrink: this.state.passConfirm || this.state.passConfirmAF}}
                    validations="equalsField:password"
                    validationErrors={{equalsField : t('REGISTER_FORM_PAGE.PASS_REPEAT_ERROR')}}
                    inputProps={{ref : ref => {this.passConfirmRef = ref }}}
                    value={this.state.passConfirm}
                    onChange={ev => this.setState({passConfirm: event.target.value, passConfirmAF: false})}
                    />
                </div>

                <div className="form-btns">
                  <Button variant="raised"
                    onMouseEnter={this.blurTextInputs}
                    color="primary"
                    type="submit"
                    disabled={!this.state.canSubmit}
                  >{t('REGISTER')}</Button>
                </div>

              </Formsy>
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
                <Button variant="raised"
                  color="primary"
                  onClick={() => store.router.goTo('login')}
                >{t('LOGIN')}</Button>
              </div>
            </div>
          </div>
        }
      </AccountFormContainer>
    )
  }
}
