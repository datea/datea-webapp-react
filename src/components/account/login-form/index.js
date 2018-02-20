import './login-form.scss';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../../i18n';

@inject('store')
@translatable
@observer
export default class LoginForm extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit : false,
      errorMsg  : false
    }
  }

  /* EVENT HANDLERS */
  enableSubmit = () => this.setState({canSubmit: true});
  disableSubmit = () => this.setState({canSubmit: false});
  notifyFormError = (e) => console.log('form error', e);
  resetError = () => this.setState({errorMsg: false});

  // TODO: put this logic into the store, error inclusive
  submit = () => this.props.store.user.login(this.refs.loginForm.getModel(), )
    .then(res => {
      const {store} = this.props;
      if (this.props.onSuccess) {
        this.props.onSuccess(res);
      } else {
        const {store} = this.props;
        if (!store.user.isNew) {
          const {view, params, queryParams} = store.user.lastLoggedOutView;
          if (view && view.name != 'welcome') {
            store.goTo(view, params, queryParams);
          } else {
            store.goTo('home');
          }
        }else{
          store.goTo('settings' ,{page: 'welcome'});
        }
      }
    })
    .catch(err => {
      console.log(err);
      if (err.response && err.response.status == 404) {
        this.setState({errorMsg: t('ACCOUNT_MSG.LOGIN_ERROR')});
      } else {
        this.setState({errorMsg: t('ERROR.UNKNOWN')});
      }
    });

  blurTextInputs = () => {
    document.querySelector('.password-field input').blur();
    document.querySelector('.username-field input').blur();
  }

  render() {
    return (
      <div className="login-form">

        {this.state.errorMsg &&
          <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.errorMsg}}></div>}

        <Formsy.Form ref="loginForm"
          onValid={this.enableSubmit}
          onInvalid={this.disableSubmit}
          onChange={this.resetError}
          onValidSubmit={this.submit}
          onInvalidSubmit={this.notifyFormError} >
            <div className="input-row">
              <FormsyText
                name="username"
                required
                className="username-field"
                floatingLabelText={t('LOGIN_PAGE.USER_PH')}
                validations="isExisty" />
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
