import './login-form.scss';
import React from 'react';
import Button from 'material-ui/Button';
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
      errorMsg  : false,
      user : '',
      pass : '',
      userAF : false,
      passAF : false
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
          const lastRoute = store.user.lastLoggedOutRoute;
          if (lastRoute) {
            store.router.goTo(lastRoute);
          } else {
            store.router.goTo('home');
          }
        }else{
          store.router.goTo('settings' ,{page: 'welcome'});
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

  componentDidMount() {
    setTimeout(() => {
      try {
        let autofillState = {userAF: false, passAF: false};
        if (this.userRef.matches(':-webkit-autofill')) {
          autofillState.userAF = true;
        }
        if (this.passRef.matches(':-webkit-autofill')) {
          autofillState.passAF = true;
        }
        this.setState(autofillState);
      } catch (e) {}
    }, 100)
  }

  render() {
    return (
      <div className="login-form" ref={ref => {this.containerRef = ref}}>

        {this.state.errorMsg &&
          <div className="error-msg" dangerouslySetInnerHTML={{__html: this.state.errorMsg}}></div>}

        <Formsy ref="loginForm"
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
                fullWidth={true}
                label={t('LOGIN_PAGE.USER_PH')}
                InputLabelProps={{shrink: !!this.state.user || this.state.userAF}}
                inputProps={{ref : ref => {this.userRef = ref}}}
                value={this.state.user}
                onChange={ev => this.setState({user: ev.target.value, userAF: false})}
                validations="isExisty" />
            </div>
            <div className="input-row">
              <FormsyText
                name="password"
                required
                fullWidth={true}
                className="password-field"
                type="password"
                label={t('PASSWORD')}
                InputLabelProps={{shrink: !!this.state.pass || this.state.passAF}}
                validations="minLength:1"
                value={this.state.pass}
                onChange={ev => this.setState({pass: ev.target.value, passAF: false})}
                inputProps={{ref : ref => {this.passRef = ref}}}
                />
            </div>
            <div className="form-btns">
              <Button variant="raised"
                onMouseEnter={this.blurTextInputs}
                color="primary"
                type="submit"
                disabled={!this.state.canSubmit}
              >{t('LOGIN_PAGE.LOGIN')}</Button>
            </div>
          </Formsy>
      </div>
    )
  }
}
