import React from 'react';
import classnames from 'classnames';
import Menu, {MenuItem, MenuList} from 'material-ui/Menu';
import Button from 'material-ui/Button';
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
    /*const labelStyle = {
      padding: 0
    };*/

    return (
      <div className={classnames('lang-switcher', ui.isMobile && 'mobile')}>
        <Button
          onClick={this.handleTouchTap}
          style={btnStyle}>
          {user.locale}
        </Button>
        <Menu
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleRequestClose}
          >
          <MenuList>
          {this.locales.filter(loc => loc != user.locale).map(loc =>
            <MenuItem key={loc} onClick={() => this.switchLang(loc)}>{loc.toUpperCase()}</MenuItem>
          )}
          </MenuList>
        </Menu>
      </div>
    );
  }
}
