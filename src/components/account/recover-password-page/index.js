import React from 'react';
import Button from 'material-ui/Button';
import {Tr, translatable} from '../../../i18n';
import {observer, inject} from 'mobx-react';
import AccountFormContainer from '../account-form-container';
import TextField from 'material-ui/TextField';
import DIcon from '../../../icons';
import './recover-password.scss';

@inject('store')
@translatable
@observer
export default class RecoverPasswordPage extends React.Component {

  render() {
    const form = this.props.store.recoverPassView;

    return (
      <AccountFormContainer className="recover-password-page">
        {!form.success &&
          <div>
            <div className="account-form-header with-icon">
              <DIcon name="daterito6" />
              <h3 className="title"><Tr id="RECOVER_PASSWORD.PAGE_TITLE" /></h3>
            </div>
            <div className="recover-password-content">

              <div className="info-text"><Tr id="RECOVER_PASSWORD.INFO_TEXT" /></div>

              {!!form.error &&
                <div className="error-msg"><Tr id={form.error} /></div>
              }

              <div className="form">

                <div className="input-row">
                  <TextField
                    name="email"
                    required
                    className="email-field"
                    fullWidth={true}
                    label={<Tr id="LOGIN_PAGE.EMAIL_PH" />}
                    onChange={ev => form.setEmail(ev.target.value)}
                    value={form.email}
                  />
                </div>

                <div className="form-btns">
                  <Button variant="raised"
                    color="primary"
                    type="submit"
                    onClick={form.submit}
                    disabled={!form.isValid}>
                    <Tr id="SUBMIT" />
                  </Button>
                </div>

              </div>
            </div>
          </div>
        }
        {form.success &&
          <div>
            <div className="account-form-header with-icon">
              <DIcon name="daterito2" />
              <h3 className="title"><Tr id="ACCOUNT_MSG.PASS_RESET_SENT_TITLE" /></h3>
            </div>
            <div className="recover-password-content reset-success">
              <div className="info-text"><Tr id="ACCOUNT_MSG.PASS_RESET_SENT" /></div>
              <div className="info-text"><Tr id="ACCOUNT_MSG.CLOSE_TAB" /></div>

              <div className="form-btns">
                <Button variant="raised"
                  color="primary"
                  onClick={form.resubmit}>
                  <Tr id="RESUBMIT" />
                </Button>
              </div>
              {form.resubmitted &&
                <div className="resubmit-success green-text"><Tr id="ACCOUNT_MSG.PASS_RESET_RESENT" /></div>
              }
              {!!form.error &&
                <div className="error-msg"><Tr id={form.error} /></div>
              }
            </div>
          </div>
        }
      </AccountFormContainer>
    )
  }
}
