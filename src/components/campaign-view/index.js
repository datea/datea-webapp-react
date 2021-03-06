import './campaign.scss';
import React, {Component, Fragment} from 'react';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import {t, translatable} from '../../i18n';
import DateaResizableMap from '../map';
import MappingLayout from '../mapping-layout';
import InfoBox from './info-box';
import {DateoTeaserList} from '../dateo';
import ContentBarRoot from './content-bar-root';
import ContentBarDetail from './content-bar-detail';
import DateoSwipeableContainer from '../dateo-swipeable-container';
import ImagePane from '../mapping-layout/image-pane';
import LegendBar from './bottom-bar';
import TopBar from './top-bar';

@inject('store')
@observer
export default class CampaignView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showMaxDateos : 12
    };
  }

  onLoadMoreDateos = () => {
    this.setState({showMaxDateos: this.state.showMaxDateos + 20});
  }

  openDateoFromTeaser = (dateo) => {
    this.props.store.openDateo({dateo});
    !!this.mappingLayoutRef && this.mappingLayoutRef.scrollToTop();
  }

  onEditClick = () => {
    const {campaign} = this.props.store.campaignView.data;
    this.props.store.router.goTo('campaignForm', {id: campaign.id});
  }

  render() {
    const {campaignView, ui, user, dateo} = this.props.store;
    const {campaign} = campaignView.data;
    const {dateos} = dateo;
    const noContentPane = campaignView.visualViewMode != 'map' && !ui.isMobile;

    if (!campaign || !campaign.id) return <span />;

    /* CONTENT PANE */
    const contentPane = noContentPane ? null : (
        campaignView.contentViewMode == 'list-view'
        ? <DateoTeaserList
            dateos={dateos}
            onLoadMoreDateos={this.onLoadMoreDateos}
            onDateoOpen={dateo => this.openDateoFromTeaser(dateo)}
            showMax={this.state.showMaxDateos} />
        : <DateoSwipeableContainer
            isVisible={campaignView.layoutMode == 'content'}
            />
    );

    /* CONTENT TOP PANE */
    const contentTopPane = noContentPane ? null : (
      campaignView.contentViewMode == 'list-view'
      ? <InfoBox
          campaign={campaign}
          onMoreInfo={() => console.log('on more info')}
          isMobile={ui.isMobile}
          showEdit={campaignView.isEditable}
          onEditClick={this.onEditClick}
          />
      : null
    );

    /* CONTENT PANE BAR */
    const contentBar = noContentPane ? null : (
      campaignView.contentViewMode == 'list-view'
      ? <ContentBarRoot
          campaign={campaign}
          mode={campaignView.layoutMode}
          onVisualClick={() => campaignView.setLayout('content')} />
      : <ContentBarDetail
          campaign={campaign}
          mode={campaignView.layoutMode}
          isMobile={ui.isMobile}
          onBackClick={
            () => campaignView.layoutMode == 'visual'
                  ? campaignView.setLayout('content')
                  : campaignView.showOverview()
          } />
    );

    /* BOTTOM BAR (only on desktop )*/
    const bottomBar = !ui.isMobile && campaign.subtags && campaign.subtags.size
      ? <LegendBar />
      : null;


    /* VISUAL PANE */
    const visualPane = (
      campaignView.visualViewMode == 'map'
        ? <DateaResizableMap mapStore={campaignView.map} />
        : <ImagePane dateos={dateos} topBar={
            <TopBar
              campaign={campaign}
              onMoreInfoClick={() => console.log('show more info')} />
          }/>
    );


    return (
      <MappingLayout
        isMobile={ui.isMobile}
        ref={r => {this.mappingLayoutRef = r;}}
        className="campaign-mapping-layout"
        visualPane={visualPane}
        contentBar={contentBar}
        contentTopPane={contentTopPane}
        contentPane={contentPane}
        bottomBar={bottomBar}
        hideContentBar={noContentPane}
        mode={campaignView.layoutMode}
        onOpenVisualClick={() => campaignView.setLayout('visual')}
        barSticky={campaignView.contentViewMode == 'detail-view' && ui.isMobile == false}
        barStickyOnContentTopScrolled={true}
      />
    );
  }
}
