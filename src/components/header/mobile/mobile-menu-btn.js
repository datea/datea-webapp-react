import React from 'react';
import IconButton from 'material-ui/IconButton';
import {observer, inject} from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import {t, translatable} from '../../../i18n';
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert';

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
        <FlatButton className="login-btn"
          label={label}
          onTouchTap={() => this.goTo(link) }
          labelStyle={{
            fontSize: '1rem',
            paddingRight: 6,
            paddingLeft: 6
          }}
          style={{marginTop: 6}}
        />
      )
    }else {
      const iconStyle = {
        width  : 30,
        height : 30,
        position: 'relative',
        top : '-3px'
      };
      return (
        <IconButton onTouchTap={this.props.onTouchTap} iconStyle={iconStyle}>
          <MoreIcon />
        </IconButton>
      );
    }
  }
}
