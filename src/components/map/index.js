import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import cn from 'classnames';
import DateaMap from './map';

const DateaResizableMap = ({mapStore, className}) =>
  <ContainerDimensions>
    { ({ width, height }) => <DateaMap className={cn('resizable', className)} height={height} width={width} mapStore={mapStore} /> }
  </ContainerDimensions>

DateaResizableMap.propTypes = {
  mapStore : PropTypes.object
};

export default DateaResizableMap;
