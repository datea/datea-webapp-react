import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {observer, inject} from 'mobx-react';
import Button from '@material-ui/core/Button';
import DIcon from '../../../icons';
import {t, translatable} from '../../../i18n';
import config from '../../../config';
import { withStyles } from '@material-ui/core/styles';

@inject('store')
export default class FacebookLoginButton extends Component {

  loginCallback = (data) => {
    console.log('fb data', data);
    this.props.store.user.getFacebookUser(data);
  }

  render = () => (
    <FacebookLogin
      appId={config.facebookAppId}
      autoLoad
      callback={this.loginCallback}
      fields="name,email,picture"
      onFailure={(e) => {
        console.log(e);
        this.props.store.ui.setLoading(false)
      }}
      render={ renderProps => (
        <Button variant="raised"
          className={cn('social-login-btn', this.props.className)}
          onClick={e => {
            this.props.store.ui.setLoading(true);
            renderProps.onClick(e);
          }}
        >
        <DIcon name="facebook" />
        {t('LOGIN_PAGE.LOGIN_FB_BTN')}
        </Button>
      )}
    />
  )
}
