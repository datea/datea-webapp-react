import './load-icons.js';
import React from 'react';
require('./icons.scss');

const DIcon = ({name, className, style}) =>
  <svg className={'d-icon icon-'+name+(className ? ' '+className: '')} style={style}>
    <use xlinkHref={'#icon-'+name}></use>
  </svg>

export default DIcon;
