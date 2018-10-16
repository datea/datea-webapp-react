import './switch-visual.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Button from '@material-ui/core/Button';
import DIcon from '../../../icons';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

const SwitchVisual = ({value, onChange}) =>
  <div className="visual-switch">
    <Button
      className={cn('switch-btn', value == 'map' && 'active')}
      onClick={() => onChange('map')}>
      <DIcon name="map-marker-multiple" className="switch-icon" />
    </Button>
    <Button
      className={cn('switch-btn', value == 'images' && 'active')}
      onClick={() => onChange('images')}>
      <PhotoCameraIcon className="switch-icon" />
    </Button>
  </div>

export default SwitchVisual;
