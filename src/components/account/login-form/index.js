import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import {observer} from 'mobx-react';
import {t, translatable} from '../../../i18n';

@translatable
@observer
export default class LoginForm extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit: false
    }
  }

  /* EVENT HANDLERS */
  enableSubmit = () => this.setState({canSubmit: true});
  disableSubmit = () => this.setState({canSubmit: false});
  notifyFormError = (e) => console.log('form error', e);
  submit = () => {
    console.log('submit');
  }
  blurTextInputs = () => {
    document.querySelector('.password-field input').blur();
    document.querySelector('.username-field input').blur();
  }

  render() {
    return (
      <div className="login-form">
        <Formsy.Form
          onValid={this.enableSubmit}
          onInvalid={this.disableSubmit}
          onValidSubmit={this.submit}
          onInvalidSubmit={this.notifyFormError} >
            <div className="input-row">
              <FormsyText
                name="username"
                required
                className="username-field"
                floatingLabelText={t('USER')}
                validations="isAlphanumeric" />
            </div>
            <div className="input-row">
              <FormsyText
                name="password"
                required
                className="password-field"
                type="password"
                floatingLabelText={t('PASSWORD')}
                validations="minLength:1" />
            </div>
            <div className="form-btns">
              <RaisedButton
                onMouseEnter={this.blurTextInputs}
                primary={true}
                type="submit"
                label={t('LOGIN_PAGE.LOGIN')}
                disabled={!this.state.canSubmit}
              />
            </div>
          </Formsy.Form>
      </div>
    )
  }
}
