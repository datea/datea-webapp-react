import './info-box.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/SettingsSharp';
import {observer} from 'mobx-react';
import {getImgSrc} from '../../../utils';
import {Tr} from '../../../i18n';
import FollowButton from '../../follow';
import ShareButton from '../../share';
import DatearBtn from '../../datear-btn';
import FullInfoDialog from './full-info';

@observer
export default class InfoBox extends Component {

  static propTypes = {
    campaign : PropTypes.object,
    isMobile : PropTypes.bool,
    showEdit : PropTypes.bool,
    onEditClick : PropTypes.func
  };

  state = {
    moreInfoOpen : false
  };

  onMoreInfoOpen = () => this.setState({moreInfoOpen: true});
  onMoreInfoClose = () => this.setState({moreInfoOpen: false});

  render() {
    const {campaign, isMobile, showEdit, onEditClick} = this.props;
    const {moreInfoOpen} = this.state;
    return (
      <div className={cn('campaign-info', isMobile && 'mobile')}>
        {!!showEdit &&
          <div className="edit-btn-container">
            <IconButton className="icon-btn" onClick={onEditClick}>
              <SettingsIcon />
            </IconButton>
          </div>
        }
        <div className="campaign-img"
          style={{backgroundImage: 'url('+getImgSrc(campaign.image.image)+')'}} onClick={() => !!onMoreInfo && onMoreInfo()}/>
        <div className="box-content">
          {!isMobile &&
            <div className="main-tag">{'#'+campaign.main_tag.tag}</div>
          }
          {!isMobile && <DatearBtn /> }
          <h3 className="campaign-title">{campaign.name}</h3>
          <div className="short-desc">{campaign.short_description}</div>
          <div className="more-info" onClick={this.onMoreInfoOpen}>
            <Tr id="MORE_INFO" />
          </div>
          <div className="actions">
            <div className="action-btn">
              <FollowButton followKey={`tag.${campaign.main_tag.id}`} />
            </div>
            <div className="action-btn">
              <ShareButton />
            </div>
          </div>
        </div>
        <FullInfoDialog campaign={campaign} isOpen={moreInfoOpen} onClose={this.onMoreInfoClose} />
      </div>
    );
  }
}
