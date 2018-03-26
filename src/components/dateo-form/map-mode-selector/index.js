import './map-mode-selector.scss';
import React, {Component} from 'react';
import Menu, { MenuItem } from 'material-ui/Menu';
import PolylineIcon from '../../mui-custom-icons/VectorPolyline';
import LocationIcon from 'material-ui-icons/LocationOn';
import IconButton from 'material-ui/IconButton';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class MapModeSelector extends Component {

  state = {
    anchorEl: null,
  };

  constructor(props, context) {
    super(props, context);
    this.clickOption = this.clickOption.bind(this);
  }

  handleOpen = ev => {
    this.setState({ anchorEl: ev.currentTarget });
  }
  handleClose = ev => {
    this.setState({ anchorEl: null });
  }

  clickOption(option){
    this.props.store.dateoForm.map.setGeometryType(option);
    this.handleClose();
  }

  render() {
    const form = this.props.store.dateoForm;
    const mode = !!form ? form.map.state.geometry.type : 'Point';
    const { anchorEl } = this.state;

    return (
      <div className="map-mode-selector">
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'map-mode-menu' : null}
          aria-haspopup="true"
          onClick={this.handleOpen}>
          {mode == 'Point' ? <LocationIcon /> : <PolylineIcon />}
        </IconButton>
        <Menu
          id="map-mode-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}>
            <MenuItem
              selected={mode === 'Point'}
              onClick={() => this.clickOption('Point')}>
              <LocationIcon />
            </MenuItem>
            <MenuItem
              selected={mode == 'GeometryCollection'}
              onClick={() => this.clickOption('GeometryCollection')}>
              <PolylineIcon />
            </MenuItem>
        </Menu>
      </div>
    );
  }
}
