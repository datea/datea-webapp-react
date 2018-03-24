import './bottom-bar.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import ButtonBase from 'material-ui/ButtonBase';

@inject('store')
@observer
export default class CampaignLegendBar extends Component {

  state = {
    isHover : false
  };

  onMouseEnter = () => this.setState({isHover : true})
  onMouseLeave = () => this.setState({isHover: false})

  render() {
    const {isHover} = this.state;
    const {campaignView, router} = this.props.store;
    const {campaign} = campaignView.data;

    let activeTags = [];
    if (router.queryParams && router.queryParams.tags) {
      activeTags = router.queryParams.tags.split(',');
    }

    return (
      <div className={cn('campaign-legend-bar', isHover && 'show-full')}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        >
        {campaign.subtags.values().map(tag =>
          <ButtonBase key={tag.tag} className={cn('ht-btn', activeTags.includes(tag.tag) && 'active')}>
            <div className="color-sample" style={{backgroundColor: tag.color}} />
            <div className="ht">{'#'+tag.tag}</div>
          </ButtonBase>
        )}
      </div>
    );
  }

}
