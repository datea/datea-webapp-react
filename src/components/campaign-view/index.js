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
import DateoSwipeableContainer from '../dateo-swipeable-container';

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

  render() {
    const {campaignView, ui, router} = this.props.store;
    const {campaign} = campaignView.data;
    let mode = 'list-view';

    if (router.queryParams.dateo) {
      mode = 'detail-view';
    }

    if (!campaign || !campaign.id) return <span />
    const {dateos} = this.props.store.dateo.data;

    return (
      <MappingLayout
        className="campaign-mapping-layout"
        visualPane={<DateaResizableMap mapStore={campaignView.map} />}
        contentBar={
          <ContentBarRoot
            campaign={campaign}
            mode={campaignView.layoutMode}
            onVisualClick={() => campaignView.setLayout('content')} />
        }
        mode={campaignView.layoutMode}
        onOpenVisualClick={() => campaignView.setLayout('visual')}
        contentTopPane={
          mode == 'list-view'
          ? <InfoBox
              campaign={campaign}
              onMoreInfo={() => console.log('on more info')}
              isMobile={ui.isMobile} />
          : null
        }
        barStickyOnContentTopScrolled={true}
        contentPane={
          mode == 'list-view'
          ? <DateoTeaserList
              dateos={dateos}
              onLoadMoreDateos={this.onLoadMoreDateos}
              onDateoOpen={campaignView.onOpenDateo}
              showMax={this.state.showMaxDateos} />
          : <DateoSwipeableContainer
              dateoId={router.queryParams.dateo}
              onSlideChange={this.onDetailSlide} />
        }
      />
    );
  }
}
