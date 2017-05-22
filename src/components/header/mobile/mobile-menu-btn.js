import React from 'react';
import USER from '../../../stores/user';
import UI from '../../../stores/ui';
import IconButton from 'material-ui/IconButton';
import {observer} from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import {t, translatable} from '../../../i18n';
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert';
import {withRouter} from 'react-router';

@withRouter
@translatable
@observer
export default class UserMenu extends React.Component {

  goTo = (path) => {
    UI.setLastLoggedOutURL();
    this.props.history.push(path);
  }

  render() {
    if (!USER.isSignedIn) {
      const label = UI.path == '/signin' ? t('REGISTER') : t('LOGIN');
      const link  = UI.path == '/signin' ? '/signup' : 'signin';
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
