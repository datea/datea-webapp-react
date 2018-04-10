import './color-sample.scss';
import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

const ColorSample = ({color, className, style}) =>
  <div className={cn('color-sample', className)} style={{backgroundColor: color, ...style}} />

ColorSample.propTypes = {
  color : PropTypes.string,
  className : PropTypes.string,
  style : PropTypes.object
};

export default ColorSample;
