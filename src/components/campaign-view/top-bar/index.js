import './top-bar.scss';
import React, {Component} from 'react';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DatearBtn from '../../datear-btn';
import {Tr} from '../../../i18n';

const CampaignTopBar = ({campaign, store, onMoreInfoClick}) =>
  <div className={cn('campaign-top-bar')}>
    {/*showButton && <DatearBtn /> */}
    <ButtonBase
      className="bar-btn"
      onClick={onMoreInfoClick}
      disableRipple={true}>
      <div className="campaign-ht">
        {'#'+campaign.main_tag.tag}
      </div>
    </ButtonBase>
  </div>

export default inject('store')(observer(CampaignTopBar));
