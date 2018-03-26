import './campaign.scss';
import React, {Component} from 'react';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../i18n';
import MapStore from '../../state/stores/map';
import DateaResizableMap from '../map';
import MappingLayout from '../mapping-layout';
import InfoBox from './info-box';
import {DateoTeaserList} from '../dateo';
import ContentBarRoot from './content-bar-root';
import ContentBarDetail from './content-bar-detail';
import DateoSwipeableContainer from '../dateo-swipeable-container';
import LegendBar from './bottom-bar';

@inject('store')
@observer
export default class CampaignView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showMaxDateos : 20
    };
  }

  onLoadMoreDateos = () => {
    this.setState({showMaxDateos: this.state.showMaxDateos + 20});
  }

  onDetailSlide = (newId) => {
    this.props.store.updateQueryParams({dateo: newId});
    this.props.store.campaignView.map.navigateToDateo(newId);
  }

  openDateoFromTeaser = (dateo) => {
    this.props.store.openDateo({dateo});
    !!this.mappingLayoutRef && this.mappingLayoutRef.scrollToTop();
  }

  onEditClick = () => {
    const {campaign} = this.props.store.campaignView.data;
    this.props.store.goTo('campaignForm', {id: campaign.id});
  }

  render() {
    const {campaignView, ui, user, dateo} = this.props.store;
    const {campaign, showDateoDetail} = campaignView.data;
    const {dateos} = dateo.data;
    const showEdit = true;
    console.log('render main campaign view');

    let mode = showDateoDetail ? 'detail-view' : 'list-view';

    if (!campaign || !campaign.id) return <span />

    return (
      <MappingLayout
        isMobile={ui.isMobile}
        ref={r => {this.mappingLayoutRef = r;}}
        className="campaign-mapping-layout"
        visualPane={<DateaResizableMap mapStore={campaignView.map} />}
        contentBar={
          mode == 'list-view'
          ? <ContentBarRoot
              campaign={campaign}
              mode={campaignView.layoutMode}
              onVisualClick={() => campaignView.setLayout('content')} />
          : <ContentBarDetail
              campaign={campaign}
              />
        }
        mode={campaignView.layoutMode}
        onOpenVisualClick={() => campaignView.setLayout('visual')}
        contentTopPane={
          mode == 'list-view'
          ? <InfoBox
              campaign={campaign}
              onMoreInfo={() => console.log('on more info')}
              isMobile={ui.isMobile}
              showEdit={showEdit}
              onEditClick={this.onEditClick}
              />
          : null
        }
        barSticky={mode == 'detail-view' && ui.isMobile == false}
        barStickyOnContentTopScrolled={true}
        contentPane={
          mode == 'list-view'
          ? <DateoTeaserList
              dateos={dateos}
              onLoadMoreDateos={this.onLoadMoreDateos}
              onDateoOpen={dateo => this.openDateoFromTeaser(dateo)}
              showMax={this.state.showMaxDateos} />
          : <DateoSwipeableContainer
              isVisible={campaignView.layoutMode == 'content'}
              dateoId={showDateoDetail}
              onSlideChange={this.onDetailSlide} />
        }
        bottomBar={
          campaign.subtags && campaign.subtags.size
          ? <LegendBar />
          : null
        }
      />
    );
  }
}
