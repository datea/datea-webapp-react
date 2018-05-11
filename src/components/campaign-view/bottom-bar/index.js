import './bottom-bar.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {when} from 'mobx';
import {observer, inject} from 'mobx-react';
import {toJS} from 'mobx';
import ButtonBase from 'material-ui/ButtonBase';
import DeleteIcon from 'material-ui-icons/Delete';
import ColorSample from '../../color-sample';
import {Tr} from '../../../i18n';

@inject('store')
@observer
export default class CampaignLegendBar extends Component {

  state = {
    isHover : false
  };

  mouseEntered = false;

  onMouseEnter = () => {
    this.mouseEntered = true;
    this.setState({isHover : true})
  }
  onMouseLeave = () => {
    this.mouseEntered = false;
    if (!this.props.store.ui.loading) {
      setTimeout(() => {
        !this.mouseEntered && this.setState({isHover: false})
      }, 500);
    } else {
      when(() => !this.props.store.ui.loading, () => {
        setTimeout( () => {
          if (this.mainRef.matches(':hover')) {
            this.mouseEntered = true;
          } else {
            this.setState({isHover: false})
          }
        }, 300);
      })
    }
  }

  getActiveTags = () => {
    const {router} = this.props.store;
    let activeTags = [];
    if (router.queryParams && router.queryParams.tags) {
      activeTags = decodeURIComponent(router.queryParams.tags).split(',');
    }
    return activeTags;
  }

  onTagClick = (tag) => {
    const {campaignView} = this.props.store;
    let activeTags = this.getActiveTags();
    if (activeTags.includes(tag)) {
      activeTags = activeTags.filter(t => t!= tag);
    } else {
      activeTags.push(tag);
    }
    campaignView.setQueryParams({tags: activeTags.join(',')});
  }

  clearTags = () => {
    const {campaignView} = this.props.store;
    campaignView.setQueryParams({tags: ''});
  }

  render() {
    const {isHover} = this.state;
    const {campaignView, router} = this.props.store;
    const {campaign} = campaignView.data;
    const activeTags = this.getActiveTags();

    return (
      <div className={cn('campaign-legend-bar', isHover && 'show-full')}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref={r => {this.mainRef = r}}
        >
        {[...campaign.subtags.values()].map(tag =>
          <ButtonBase
            key={tag.tag}
            className={cn('ht-btn', activeTags.includes(tag.tag) && 'active')}
            onClick={() => this.onTagClick(tag.tag)}>
            <ColorSample color={tag.color} />
            <div className="ht">{'#'+tag.tag}</div>
          </ButtonBase>
        )}
        {!!activeTags.length &&
            <ButtonBase
              className="clear-btn"
              onClick={this.clearTags}>
              <DeleteIcon />
              <Tr id="CLEAR_SELECTION" />
            </ButtonBase>
        }
      </div>
    );
  }

}
