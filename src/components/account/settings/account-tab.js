import React from 'react';
import {observer, inject} from 'mobx-react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Tr} from '../../../i18n';
import DIcon from '../../../icons';

@inject('store')
@observer
export default class AccountTab extends React.Component {

  renderErrorTxt = (field) => {
    const error = this.props.store.settingsView.error;
    return error.has(field) ? <Tr id={error.get(field)} /> : '';
  }

  render() {
    const form = this.props.store.settingsView;
    return (
      <div className="settings-tab-content account-tab">

        {form.error.has('main') &&
          <div className="error-msg"><Tr id={form.error.get('main')} /></div>
        }

        <Dialog open={form.emailDialogOpen} className="account-dialog" onClose={form.closeEmailDialog}>
          <DialogTitle>
            <span className="dialog-title">
              <DIcon name="daterito4"/>
              <Tr id="SETTINGS_PAGE.CHANGE_EMAIL_WARNING_TITLE" />
            </span>
          </DialogTitle>
          <DialogContent><Tr id="SETTINGS_PAGE.CHANGE_EMAIL_WARNING" /></DialogContent>
          <DialogActions>
            <Button color="primary" onClick={form.closeEmailDialog}>
              <Tr id="CANCEL" />
            </Button>
            <Button color="primary" focusRipple={true} onClick={() => form.submit(false)}>
              <Tr id="SETTINGS_PAGE.CHANGE_EMAIL_PROCEED" />
            </Button>
          </DialogActions>
        </Dialog>

        <div className="form">

          <div className="input-row">
            <TextField
              name="username"
              required
              fullWidth={true}
              value={form.user.username}
              onChange={ev => form.setUsername(ev.target.value)}
              className="username-field form-field"
              label={<Tr id="REGISTER_FORM_PAGE.USERNAME_LABEL" />}
              error={form.error.has('username')}
              helperText={this.renderErrorTxt('username')}
              />
          </div>

          <div className="input-row">
            <TextField
              name="email"
              required
              fullWidth={true}
              value={form.user.email}
              onChange={ev => form.setEmail(ev.target.value)}
              className="email-field form-field"
              label={<Tr id="REGISTER_FORM_PAGE.EMAIL_LABEL" />}
              error={form.error.has('email')}
              helperText={this.renderErrorTxt('email')}
              />
          </div>

          <div className="show-pass-container">
            <Button onClick={form.toggleShowPassword}>
              <Tr id={'SETTINGS_PAGE.'+(form.showChangePassword ? 'HIDE' : 'SHOW')+'_CHANGE_PASSWORD'} />
            </Button>
          </div>

          {form.showChangePassword &&
            <div>
              <div className="input-row">
                <TextField
                  name="password"
                  type="password"
                  fullWidth={true}
                  value={form.password}
                  onChange={ev => form.setPassword(ev.target.value)}
                  className="password-field form-field"
                  label={<Tr id="SETTINGS_PAGE.NEW_PASSWORD" />}
                  error={form.error.has('password')}
                  helperText={this.renderErrorTxt('password')}
                  />
              </div>

              <div className="input-row">
                <TextField
                  name="passwordConfirm"
                  type="password"
                  fullWidth={true}
                  value={form.passConfirm}
                  onChange={ev => form.setPassConfirm(ev.target.value)}
                  className="password-confirm-field form-field"
                  label={<Tr id="REGISTER_FORM_PAGE.REPEAT_PASS" />}
                  error={form.error.has('passConfirm')}
                  helperText={this.renderErrorTxt('passConfirm')}
                  />
              </div>
            </div>
          }

          <div className="form-btns">
            <Button variant="raised"
              color="primary"
              type="submit"
              onClick={form.submit}
              disabled={!form.isValid}>
              <Tr id="SAVE" />
            </Button>
          </div>

        </div>
      </div>
    );
  }
}
