import './color-picker.scss';
import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import ButtonBase from '@material-ui/core/ButtonBase';
import {SwatchesPicker} from 'react-color';
import {colors} from '../../config/colors';

export default class ColorPicker extends Component {

  static propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func
  };

  state = {
    open : false,
    anchorEl : null
  };

  componentDidMount() {
    this.setState({
      anchorEl : findDOMNode(this.btnRef)
    });
  }

  toggleOpen = () => {
    this.setState({open: !this.state.open});
  }

  onColorPicked = (color) => {
    this.toggleOpen();
    this.props.onChange(color.hex);
  }

  render() {
    const {color, onChange} = this.props;
    return (
      <div className="color-picker">
        <ButtonBase className="color-picker-btn"
          onClick={this.toggleOpen}
          ref={r => {this.btnRef = r}}
          >
          <div className="sample-color" style={{backgroundColor: this.props.color}} />
        </ButtonBase>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.toggleOpen}>
          <SwatchesPicker colors={colors} hex={this.props.color} onChange={this.onColorPicked} />
        </Popover>
      </div>
    )
  }


}
