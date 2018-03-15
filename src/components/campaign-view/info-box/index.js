import './info-box.scss';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {getImgSrc} from '../../../utils';
import {Tr} from '../../../i18n';
import Button from 'material-ui/Button';

const InfoBox = ({campaign, onMoreInfo, isMobile}) =>
  <div className="campaign-info">
    <div className="campaign-img"
      style={{backgroundImage: 'url('+getImgSrc(campaign.image.image)+')'}}
      onClick={() => !!onMoreInfo && onMoreInfo()}
    />
    <div className="box-content">
      {!isMobile && <div className="main-tag">{'#'+campaign.main_tag.tag}</div>}
      <h3 className="campaign-title">{campaign.name}</h3>
      <div className="short-desc">{campaign.short_description}</div>
      <div className="more-info" onClick={() => !!onMoreInfo && onMoreInfo()}>
        <Tr id="MORE_INFO" />
      </div>
    </div>
  </div>

export default observer(InfoBox);
