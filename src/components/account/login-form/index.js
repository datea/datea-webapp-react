import './login-form.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {observer, inject} from 'mobx-react';
import {Tr} from '../../../i18n';

@inject('store')
@observer
export default class LoginForm extends React.Component {

  static propTypes = {
    onSuccess : PropTypes.func
  };

  render() {
    const {store} = this.props;
    const login = store.loginView;
    return (
      <div className="login-form" ref={ref => {this.containerRef = ref}}>

        {!!login.error &&
          <div className="error-msg"><Tr id={login.error} /></div>
        }

        <div className="form">

            <div className="input-row">
              <TextField
                name="username"
                required
                className="username-field"
                fullWidth={true}
                label={<Tr id='LOGIN_PAGE.USER_PH' />}
                value={login.username}
                onChange={ev => login.setUsername(ev.target.value)}
              />
            </div>
            <div className="input-row">
              <TextField
                name="password"
                required
                fullWidth={true}
                className="password-field"
                type="password"
                label={<Tr id="PASSWORD" />}
                value={login.password}
                onChange={ev => login.setPassword(ev.target.value)}
              />
            </div>
            <div className="form-btns">
              <Button variant="raised"
                color="primary"
                type="submit"
                onClick={() => login.login(this.props.onSuccess)}
                disabled={!login.isValid}>
                <Tr id="LOGIN_PAGE.LOGIN" />
              </Button>
            </div>
          </div>
      </div>
    )
  }
}
