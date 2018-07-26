import './campaign-avatar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import DIcon from '../../icons';
import {getImgSrc} from '../../utils';

const CampaignAvatar = ({src, className, style}) => !!src
  ? <Avatar src={getImgSrc(src)}
      className={cn('campaign-img-avatar', className)}
      style={{...style, borderRadius: '5px'}} />
    : <Avatar className={cn('campaign-default-avatar', className)}
      style={{...style, borderRadius: '5px'}}>
      <DIcon name="map-marker-multiple" />
    </Avatar>

CampaignAvatar.propTypes = {
  src : PropTypes.string,
  className : PropTypes.string,
  style : PropTypes.object
}

export default CampaignAvatar;
