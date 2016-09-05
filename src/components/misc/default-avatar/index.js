import React from 'react';
import PersonIcon from 'material-ui/svg-icons/social/person';
import './default-avatar.scss';

const DefaultAvatar = ({size}) =>
  <div className="default-avatar" style={{width: size, height: size}}>
    <PersonIcon style={{height: size*0.95, width: size*0.95}} color="#efefef" />
  </div>

export default DefaultAvatar;