import './mode-selector.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SearchIcon from 'material-ui-icons/Search';
import IconButton from 'material-ui/IconButton';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import Menu, { MenuItem } from 'material-ui/Menu';
import {Tr} from '../../../i18n';

export default class SearchModeSelector extends Component {

  static propTypes = {
    onModeSelect : PropTypes.func,
    mode : PropTypes.string,
    onOpen : PropTypes.func,
    onClose : PropTypes.func,
  };

  state = {
    anchorEl : null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
    !!this.props.onOpen && this.props.onOpen();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
    !!this.props.onClose && this.props.onClose();
  };

  onSelect = (mode) => {
    this.props.onModeSelect(mode)
    this.handleClose();
  }

  render () {
    const {anchorEl} = this.state;
    const {mode} = this.props;
    return [
      <IconButton key="btn" onClick={this.handleClick} className="search-mode-icon-btn">
        <SearchIcon className="search-icon" />
        <ArrowDropDownIcon className="dropdown-icon" />
      </IconButton>,
      <Menu
        key="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleClose}>
        <MenuItem selected={mode === 'mapeo'} onClick={() => this.onSelect('mapeo')}>
          <Tr id="SEARCHBOX.LOCAL_SEARCH" />
        </MenuItem>
        <MenuItem selected={mode === 'global'} onClick={() => this.onSelect('global')}>
          <Tr id="SEARCHBOX.GLOBAL_SEARCH" />
        </MenuItem>
      </Menu>
    ]
  }
}
