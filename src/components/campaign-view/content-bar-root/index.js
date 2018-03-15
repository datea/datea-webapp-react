import './campaign-content-bar-root.scss';
import React, {Component} from 'react';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import ButtonBase from 'material-ui/ButtonBase';
import DatearBtn from '../../datear-btn';
import {Tr} from '../../../i18n';

const CampaignContentBarRoot = ({campaign, mode, doScrollTop, onVisualClick, showButton = true, store}) =>
  <div className={cn('campaign-content-bar-root', `mode-${mode}`)}>
    {showButton && <DatearBtn />}
    <ButtonBase
      className="bar-btn"
      onClick={() => mode == 'content' ? doScrollTop() : onVisualClick()}
      disableRipple={mode == 'content'}>

      <div className="campaign-ht">
        {'#'+campaign.main_tag.tag}
      </div>

    </ButtonBase>
  </div>

export default inject('store')(observer(CampaignContentBarRoot));
