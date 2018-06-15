import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {observer, inject} from 'mobx-react';
import {Tr, translatable} from '../../../i18n';
import DateroIcon from '../../../theme/datero-caminando';
import AccountFormContainer from '../account-form-container';
import {emailExists, usernameExists} from '../../../utils';
import config from '../../../config';
import DIcon from '../../../icons';
import './register-form-page.scss';

@inject('store')
@observer
export default class RegisterFormPage extends React.Component {

  getErrorText = (field) => {
    const {error} = this.props.store.registerView;
    return error.has(field) ? <Tr id={error.get(field)} /> : '';
  }

  render() {
    const {store} = this.props;
    const {registerView: register} = store;
    return (
      <AccountFormContainer className="register-form-page">
        {!register.success &&
          <div>
            <div className="account-form-header with-icon">
              <DIcon name="daterito1" />
              <h3 className="title"><Tr id="REGISTER_FORM_PAGE.TITLE" /></h3>
            </div>
            <div className="register-form-content">

              {!!register.error.has('main') &&
                <div className="error-msg"><Tr id={register.error.get('main')} /></div>
              }

              <div className="form">
                <div className="input-row">
                  <TextField
                    name="username"
                    required={true}
                    fullWidth={true}
                    className="username-field"
                    label={<Tr id="REGISTER_FORM_PAGE.USERNAME_LABEL" />}
                    value={register.username}
                    onChange={ev => register.setUsername(ev.target.value)}
                    error={register.error.has('username')}
                    helperText={this.getErrorText('username')}
                    />
                </div>

                <div className="input-row">
                  <TextField
                    name="email"
                    fullWidth={true}
                    required={true}
                    className="email-field"
                    label={<Tr id="REGISTER_FORM_PAGE.EMAIL_LABEL" />}
                    value={register.email}
                    error={register.error.has('email')}
                    helperText={this.getErrorText('email')}
                    onChange={ev => register.setEmail(ev.target.value)}
                    />
                </div>

                <div className="input-row">
                  <TextField
                    name="password"
                    type="password"
                    required
                    fullWidth={true}
                    className="password-field"
                    label={<Tr id="REGISTER_FORM_PAGE.PASS_LABEL" />}
                    value={register.password}
                    onChange={ev => register.setPassword(ev.target.value)}
                    error={register.error.has('password')}
                    helperText={this.getErrorText('password')}
                    />
                </div>

                <div className="input-row">
                  <TextField
                    name="passwordConfirm"
                    type="password"
                    required
                    fullWidth={true}
                    className="password-confirm-field"
                    label={<Tr id="REGISTER_FORM_PAGE.REPEAT_PASS" />}
                    value={register.passConfirm}
                    error={register.error.has('passConfirm')}
                    helperText={this.getErrorText('passConfirm')}
                    onChange={ev => register.setPassConfirm(ev.target.value)}
                  />
                </div>

                <div className="form-btns">
                  <Button variant="raised"
                    color="primary"
                    type="submit"
                    onClick={register.save}
                    disabled={!register.isValid}
                  ><Tr id="REGISTER" /></Button>
                </div>

              </div>
            </div>
          </div>
        }

        {register.success &&
          <div>
            <div className="account-form-header with-icon">
              <DIcon name="daterito1" />
              <h3 className="title"><Tr id="REGISTER_FORM_PAGE.CONFIRM_TITLE" /></h3>
            </div>
            <div className="register-success-message">
              <div className="info-text"><Tr id="REGISTER_FORM_PAGE.CONFIRM1" /></div>
              <div className="info-text"><Tr id="REGISTER_FORM_PAGE.CONFIRM2" /></div>
              <div className="form-btns">
                <Button variant="raised"
                  color="primary"
                  onClick={() => store.router.goTo('login')}
                ><Tr id="LOGIN" /></Button>
              </div>
            </div>
          </div>
        }
      </AccountFormContainer>
    )
  }
}
