import './info-box.scss';
import React, {Component} from 'react';
import cn from 'classnames';
import {observer} from 'mobx-react';
import {getImgSrc} from '../../../utils';
import {Tr} from '../../../i18n';
import Button from 'material-ui/Button';
import DatearBtn from '../../datear-btn';

const InfoBox = ({campaign, onMoreInfo, isMobile}) =>
  <div className={cn('campaign-info', isMobile && 'mobile')}>
    <div className="campaign-img"
      style={{backgroundImage: 'url('+getImgSrc(campaign.image.image)+')'}}
      onClick={() => !!onMoreInfo && onMoreInfo()}
    />
    <div className="box-content">
      {!isMobile && <div className="main-tag">{'#'+campaign.main_tag.tag}</div>}
      {!isMobile && <DatearBtn /> }
      <h3 className="campaign-title">{campaign.name}</h3>
      <div className="short-desc">{campaign.short_description}</div>
      <div className="more-info" onClick={() => !!onMoreInfo && onMoreInfo()}>
        <Tr id="MORE_INFO" />
      </div>
    </div>
  </div>

export default observer(InfoBox);
