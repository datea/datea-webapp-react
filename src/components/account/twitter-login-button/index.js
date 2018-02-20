import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component';
import TwIcon from 'material-ui-community-icons/icons/twitter';
import {observer, inject} from 'mobx-react';
import RaisedButton from 'material-ui/RaisedButton';
import {t, translatable} from '../../../i18n';

class TwitterLoginButton extends TwitterLogin {

  onButtonClick = () => {
    this.props.store.ui.setLoading(true);
    return this.getRequestToken();
  }

  render = () =>
    <RaisedButton
      label={t('LOGIN_PAGE.LOGIN_TW_BTN')}
      icon={<TwIcon />}
      className={cn('social-login-btn', this.props.className)}
      onTouchTap={this.onButtonClick}
    />
}

const TwitterLoginButtonWithActions = (props) => {
    const {onSuccess, onFailure, onError, store, ...otherProps} = props;
    return <TwitterLoginButton
            loginUrl="http://localhost:8000/api/v2/account/twitter-login"
            requestTokenUrl="http://localhost:8000/api/v2/account/twitter-request-token"
            {...otherProps}
            store={store}
            onSuccess={result => result.json().then(body => store.user.loadSocialUser(body))}
            onFailure={() => store.ui.setLoading(false)}
            />
}

export default inject('store')(translatable(TwitterLoginButtonWithActions))
