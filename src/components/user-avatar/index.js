import React from 'react';
import PropTypes from 'prop-types';
import DefaultAvatar from '../misc/default-avatar';
import Avatar from 'material-ui/Avatar';
import {getImgSrc} from '../../utils';

const UserAvatar = ({src, size}) =>
  src ? <Avatar src={getImgSrc(src)} size={size} /> : <DefaultAvatar size={size} />

UserAvatar.propTypes = {
  src  : PropTypes.string,
  size : PropTypes.number.isRequired
}

export default UserAvatar;
