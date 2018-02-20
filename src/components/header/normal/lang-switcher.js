import React from 'react';
import classnames from 'classnames';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import {observer, inject} from 'mobx-react';
import {translatable} from '../../../i18n';

@inject('store')
@translatable
@observer
export default class LangSwitcher extends React.Component {

  locales = ['es', 'fr'];

  constructor(props) {
    super(props);
    this.state = { open: false};
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  switchLang = (loc) => {
    this.props.store.user.setLocale(loc);
    this.setState({open: false});
  }

  render() {
    const {user, ui} = this.props.store;
    if (ui.isMobile) return <span></span>;

    const btnStyle = {
      //border: '1px solid black',
      height: 40,
      width: 40,
      minWidth: 40,
      padding: 0,
      textAlign: 'center',
      borderRadius: '50%'
    }
    const labelStyle = {
      padding: 0
    };

    return (
      <div className={classnames('lang-switcher', ui.isMobile && 'mobile')}>
        <FlatButton
          onTouchTap={this.handleTouchTap}
          label={user.locale}
          style={btnStyle}
          labelStyle={labelStyle} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            {this.locales.filter(loc => loc != user.locale).map(loc =>
              <MenuItem key={loc} primaryText={loc.toUpperCase()} onTouchTap={() => this.switchLang(loc)}/>
            )}
          </Menu>
        </Popover>
      </div>
    );
  }
}
