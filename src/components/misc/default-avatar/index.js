import './default-avatar.scss';
import React from 'react';
import PersonIcon from 'material-ui-icons/Person';

const DefaultAvatar = ({size}) =>
  <div className="default-avatar" style={{width: size, height: size}}>
    <PersonIcon className="person-icon" style={{height: size*0.95, width: size*0.95, fill: '#efefef'}} />
  </div>

export default DefaultAvatar;
