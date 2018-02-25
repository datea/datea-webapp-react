import './campaign-content-bar-root.scss';
import React, {Component} from 'react';
import {observer} from 'mobx-react';


const CampaignContentBarRoot = ({campaign, doScrollTop}) =>
  <div className="campaign-content-bar-root">
    <div className="campaign-ht" onClick={() => !!doScrollTop && doScrollTop()}>
      {'#'+campaign.main_tag.tag}
    </div>
  </div>

export default observer(CampaignContentBarRoot);
