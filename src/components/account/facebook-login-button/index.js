import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import FbIcon from 'material-ui-community-icons/icons/facebook';
import {observer, inject} from 'mobx-react';
import RaisedButton from 'material-ui/RaisedButton';
import {t, translatable} from '../../../i18n';
import config from '../../../config';

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
        <RaisedButton
          label={t('LOGIN_PAGE.LOGIN_FB_BTN')}
          icon={<FbIcon />}
          className={cn('social-login-btn', this.props.className)}
          onTouchTap={e => {
            this.props.store.ui.setLoading(true);
            renderProps.onClick(e);
          }}
        />
      )}
    />
  )
}
