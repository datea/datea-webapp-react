import React from 'react';
import Button from 'material-ui/Button';
import {t, translatable} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import AccountFormContainer from '../account-form-container';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import DIcon from '../../../icons';
import './recover-password-confirm.scss';
import config from '../../../config';
import LoginForm from '../login-form';

@inject('store')
@translatable
@observer
export default class RecoverPasswordConfirmPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit : false,
      success   : false,
      error     : '',
      errorCode : null,
      pass : '',
      passConfirm : ''
    };
    this.email = '';
  }

  enableSubmit = () => this.setState({canSubmit: true});
  disableSubmit = () => this.setState({canSubmit: false});
  blurTextInputs = () => {
    document.querySelector('.password-field input').blur();
    document.querySelector('.password-confirm-field input').blur();
  }
  startOver = () => this.props.store.goTo('recover-password');

  submit = () => {
    this.setState({error: false});
    const {params} = this.props.router;
    if (!queryParams) return;
    const data = {
      uid      : params.uid,
      token    : params.token,
      password : this.refs.passConfirmForm.getModel().password
    }
    this.props.store.user.confirmResetPassword(data)
    .then(res => this.setState({success: true}))
    .catch(err => {
      switch (err.response.status) {
        case 400:
          this.setState({error: t('PASSW_PAGE.ERROR_MSG'), errorCode: 400});
          break;
        case 401:
          this.setState({error: t('ACCOUNT_MSG.BLOCKED'), errorCode: 401});
          break;
        default:
          this.setState({error: t('ERROR.UNKNOWN'), errorCode: 500});
      }
    })
  };

  // avoid autofill to hover on label
  componentDidMount() {
    const event = new Event('input', { bubbles: true });
    this.passRef.dispatchEvent(event);
    this.passConfirmRef.dispatchEvent(event);
  }

  renderRecoverForm() {
    return (
      <div>
        <div className="account-form-header with-icon">
          <DIcon name="daterito4" />
          <h3 className="title">{t('PASSW_PAGE.TITLE')}</h3>
        </div>
        <div className="password-confirm-content recover-form">

          {!!this.state.error &&
            <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.error}}></div>
          }

          <Formsy ref="passConfirmForm"
            onValid={this.enableSubmit}
            onInvalid={this.disableSubmit}
            onValidSubmit={this.submit} >

            <div className="input-row">
              <FormsyText
                name="password"
                type="password"
                fullWidth={true}
                required
                autoComplete="off"
                className="password-field"
                label={t('PASSW_PAGE.PASS_LABEL')}
                validations={{matchRegexp: config.validation.password.regex}}
                validationErrors={{matchRegexp : t('REGISTER_FORM_PAGE.PASS_DESC')}}
                inputProps={{ref : ref => {this.passRef = ref }}}
                value={this.state.pass}
                onChange={ev => this.setState({pass: event.target.value})}
                />
            </div>

            <div className="input-row">
              <FormsyText
                name="passwordConfirm"
                type="password"
                required
                autoComplete="off"
                fullWidth={true}
                className="password-confirm-field"
                label={t('PASSW_PAGE.REPEAT_LABEL')}
                validations="equalsField:password"
                validationErrors={{equalsField : t('REGISTER_FORM_PAGE.PASS_REPEAT_ERROR')}}
                inputProps={{ref : ref => {this.passConfirmRef = ref }}}
                value={this.state.passConfirm}
                onChange={ev => this.setState({passConfirm: event.target.value})}
                />
            </div>

            <div className="form-btns">
              <Button variant="raised"
                onMouseEnter={this.blurTextInputs}
                color="primary"
                type="submit"
                disabled={!this.state.canSubmit}
              >{t('PASSW_PAGE.SAVE_BTN')}</Button>
            </div>

          </Formsy>
        </div>
      </div>
    )
  }

  renderSuccess() {
    return (
      <div>
        <div className="account-form-header with-icon">
          <DIcon name="daterito3" />
          <h3 className="title">{t('PASSW_PAGE.SUCCESS_TITLE')}</h3>
        </div>
        <div className="password-confirm-content reset-success">
          <div className="info-text">{t('PASSW_PAGE.SUCCESS_MSG')}</div>
          <LoginForm />
        </div>
      </div>
    )
  }

  renderRecoverExpired() {
    return (
      <div>
        <div className="account-form-header with-icon">
          <DIcon name="daterito6" />
          <h3 className="title">{t('PASSW_PAGE.ERROR_TITLE')}</h3>
        </div>
        <div className="password-confirm-content reset-expired">
          <div className="info-text">{t('PASSW_PAGE.ERROR_MSG')}</div>
          <div className="form-btns">
            <Button variant="raised"
              onClick={this.startOver}
              color="primary"
            >{t('PASSW_PAGE.STARTOVER_BTN')}</Button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let content;
    if (!this.state.success && this.state.errorCode != 400) {
      content = this.renderRecoverForm();
    } else if (this.state.success) {
      content = this.renderSuccess();
    } else if (this.state.errorCode == 400) {
      content = this.renderRecoverExpired();
    }
    return (
      <AccountFormContainer className="password-confirm-page">
        {content}
      </AccountFormContainer>
    )
  }
}
