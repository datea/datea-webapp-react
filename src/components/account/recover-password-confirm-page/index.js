import React from 'react';
import Button from 'material-ui/Button';
import {Tr} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import AccountFormContainer from '../account-form-container';
import TextField from 'material-ui/TextField';
import DIcon from '../../../icons';
import './recover-password-confirm.scss';
import config from '../../../config';
import LoginForm from '../login-form';

@inject('store')
@observer
export default class RecoverPasswordConfirmPage extends React.Component {

  startOver = () => this.props.store.router.goTo('recoverPass');

  renderErrorTxt(field) {
    const error = this.props.store.recoverPassConfirmView.error;
    return error.has(field) ? <Tr id={error.get(field)} /> : '';
  }

  renderRecoverForm() {
    const form = this.props.store.recoverPassConfirmView;

    return (
      <div>
        <div className="account-form-header with-icon">
          <DIcon name="daterito4" />
          <h3 className="title"><Tr id="PASSW_PAGE.TITLE" /></h3>
        </div>
        <div className="password-confirm-content recover-form">

          {form.error.has('main') &&
            <div className="error-msg"><Tr id={form.error.get('main')} /></div>
          }

          <div className="form">
            <div className="input-row">
              <TextField
                name="password"
                type="password"
                fullWidth={true}
                required
                autoComplete="off"
                className="password-field"
                label={<Tr id="PASSW_PAGE.PASS_LABEL" />}
                error={form.error.has('password')}
                helperText={this.renderErrorTxt('password')}
                value={form.password}
                onChange={ev => form.setPassword(ev.target.value)}
                />
            </div>

            <div className="input-row">
              <TextField
                name="passwordConfirm"
                type="password"
                required
                autoComplete="off"
                fullWidth={true}
                className="password-confirm-field"
                label={<Tr id="PASSW_PAGE.REPEAT_LABEL" />}
                error={form.error.has('passwordConfirm')}
                helperText={this.renderErrorTxt('passwordConfirm')}
                value={form.passwordConfirm}
                onChange={ev => form.setPasswordConfirm(ev.target.value)}
                />
            </div>

            <div className="form-btns">
              <Button variant="raised"
                color="primary"
                type="submit"
                onClick={form.submit}
                disabled={!form.isValid}>
                <Tr id="PASSW_PAGE.SAVE_BTN" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderSuccess() {
    return (
      <div>
        <div className="account-form-header with-icon">
          <DIcon name="daterito3" />
          <h3 className="title"><Tr id="PASSW_PAGE.SUCCESS_TITLE" /></h3>
        </div>
        <div className="password-confirm-content reset-success">
          <div className="info-text"><Tr id="PASSW_PAGE.SUCCESS_MSG" /></div>
          <LoginForm />
        </div>
      </div>
    )
  }

  renderRecoverExpired() {
    const recover = this.props.store.recoverPassConfirmView;
    return (
      <div>
        <div className="account-form-header with-icon">
          <DIcon name="daterito6" />
          <h3 className="title"><Tr id="PASSW_PAGE.ERROR_TITLE" /></h3>
        </div>
        <div className="password-confirm-content reset-expired">
          <div className="info-text"><Tr id="PASSW_PAGE.ERROR_MSG" /></div>
          <div className="form-btns">
            <Button variant="raised"
              onClick={this.startOver}
              color="primary">
              <Tr id="PASSW_PAGE.STARTOVER_BTN" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const form = this.props.store.recoverPassConfirmView;
    console.log('form', form);
    let content;
    if (!form.success && form.errorCode != 400) {
      content = this.renderRecoverForm();
    } else if (form.success) {
      content = this.renderSuccess();
    } else if (form.errorCode == 400) {
      content = this.renderRecoverExpired();
    }
    return (
      <AccountFormContainer className="password-confirm-page">
        {content}
      </AccountFormContainer>
    )
  }
}
