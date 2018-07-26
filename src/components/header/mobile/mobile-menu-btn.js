import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import {observer, inject} from 'mobx-react';
import Button from '@material-ui/core/Button';
import {t, translatable} from '../../../i18n';
import MoreIcon from '@material-ui/icons/MoreVert';

@inject('store')
@translatable
@observer
export default class UserMenu extends React.Component {

  goTo = (view) => {
    this.props.store.router.goTo(view);
  }

  render() {
    const {ui, user, router} = this.props.store;
    if (!user.isSignedIn) {
      const currentRoute = router.getCurrentRoute();
      const label = currentRoute.name == 'login' ? t('REGISTER') : t('LOGIN');
      const link  = currentRoute.name == 'login' ? 'register' : 'login';
      return (
        <Button className="login-btn"
          onClick={() => this.goTo(link) }
          style={{marginTop: 6, paddingLeft: 0, paddingRight: 0}}
        >{label}</Button>
      )
    }else {
      return (
        <IconButton onClick={this.props.onClick}>
          <MoreIcon className="header-mobile-menu-icon" />
        </IconButton>
      );
    }
  }
}
