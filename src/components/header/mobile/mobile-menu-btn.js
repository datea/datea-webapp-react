import React from 'react';
import IconButton from 'material-ui/IconButton';
import {observer, inject} from 'mobx-react';
import Button from 'material-ui/Button';
import {t, translatable} from '../../../i18n';
import MoreIcon from 'material-ui-icons/MoreVert';

@inject('store')
@translatable
@observer
export default class UserMenu extends React.Component {

  goTo = (view) => {
    this.props.store.goTo(view);
  }

  render() {
    const {ui, user, router} = this.props.store;
    if (!user.isSignedIn) {
      const label = router.currentView.name == 'login' ? t('REGISTER') : t('LOGIN');
      const link  = router.currentView.name == 'login' ? 'register' : 'login';
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
