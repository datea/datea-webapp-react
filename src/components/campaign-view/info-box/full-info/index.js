import './full-info.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import {getImgSrc} from '../../../../utils';
import {Tr} from '../../../../i18n';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import UserAvatar from '../../../user-avatar';
import Link from '../../../link';
import {DateAuthored} from '../../../author-header';


const FullInfoDialog = ({campaign, isOpen, onClose, fullScreen}) =>
  <Dialog fullScreen={fullScreen} onClose={onClose} open={isOpen} scroll="body">
    <div className="campaign-info full-info">
      <Card>
        <CardHeader
          avatar={<UserAvatar src={campaign.user.image} size={60} />}
          title={<Link route="profile" params={{username: campaign.user.username}}>{campaign.user.username}</Link>}
          subheader={<DateAuthored date={campaign.created} />}
          action={
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            }
        />
      <CardMedia style={{paddingTop: '40%'}} image={getImgSrc(campaign.image.image)} />
        <CardContent>
          <h3 className="campaign-title">{campaign.name}</h3>
          <div className="short-desc">{campaign.short_description}</div>

          <div className="info-field-title"><Tr id="CAMPAIGN.MISSION_TITLE" /></div>
          <div className="info-field-content">{campaign.mission}</div>

          <div className="info-field-title"><Tr id="CAMPAIGN.DATA_TITLE" /></div>
          <div className="info-field-content">{campaign.information_destiny}</div>
        </CardContent>
        <CardActions>
          <Button onClick={onClose}><Tr id="CLOSE" /></Button>
        </CardActions>
      </Card>
    </div>
  </Dialog>

FullInfoDialog.propTypes = {
  isOpen : PropTypes.bool,
  onClose : PropTypes.func,
  fullScreen : PropTypes.bool
};

export default withMobileDialog()(FullInfoDialog);
