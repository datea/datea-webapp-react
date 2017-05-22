import React from 'react';
import classnames from 'classnames';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import UI from '../../../stores/ui';
import USER from '../../../stores/user';
import {observer} from 'mobx-react';
import {translatable} from '../../../i18n';

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
    USER.setLocale(loc);
    this.setState({open: false});
  }

  render() {
    if (UI.isMobile) return <span></span>;

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
      <div className={classnames('lang-switcher', UI.isMobile && 'mobile')}>
        <FlatButton
          onTouchTap={this.handleTouchTap}
          label={USER.locale}
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
            {this.locales.filter(loc => loc != USER.locale).map(loc =>
              <MenuItem key={loc} primaryText={loc.toUpperCase()} onTouchTap={() => this.switchLang(loc)}/>
            )}
          </Menu>
        </Popover>
      </div>
    );
  }
}
