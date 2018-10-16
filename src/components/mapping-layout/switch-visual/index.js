import './switch-visual.scss';
import React, {Component, Fragment} from 'React';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DIcon from '../../../icons';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

export default class SwitchVisual extends Component {

  static propTypes : {
    value : PropTypes.string,
    onChange : PropTypes.func
  };

  state = {
    anchor : null
  };

  openMenu = (ev) => this.setState({anchor: ev.currentTarget});
  closeMenu = () => this.setState({anchor: null});
  select = (val) => {
    this.closeMenu();
    this.props.onChange && this.props.onChange(val);
  }

  renderIcon = (value) => {
    switch (value) {
      case 'map' :
        return <DIcon name="map-marker-multiple" />;
      case 'images':
        return <PhotoCameraIcon />
    }
  }

  render() {
    const {anchor} = this.state;
    const {value, onChange} = this.props;
    return (
      <Fragment>
        <Button variant="fab" onClick={this.openMenu} className="switch-visual-btn">
          <ArrowDropDownIcon className="drop" />
          {this.renderIcon(value)}
        </Button>
        <Menu open={Boolean(anchor)}
          anchorEl={anchor}
          onClose={this.closeMenu}
          className="switch-visual-menu">
          <MenuItem className="switch-visual-menu-item" onClick={() => this.select('map')} selected={value == 'map'}>
            <DIcon name="map-marker-multiple" />
          </MenuItem>
          <MenuItem className="switch-visual-menu-item" onClick={() => this.select('images')} selected={value == 'images'}>
            <PhotoCameraIcon />
          </MenuItem>
        </Menu>
      </Fragment>
    );
  }

}
