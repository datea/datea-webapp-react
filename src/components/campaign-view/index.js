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

  render() {
    const {campaignView} = this.props.store;
    const {campaign} = campaignView.data;

    if (!campaign || !campaign.id) return <span />
    const {dateos} = this.props.store.dateo.data;

    return (
      <MappingLayout
        visualPane={<DateaResizableMap mapStore={campaignView.map} />}
        contentBar={<ContentBarRoot campaign={campaign} />}
        contentTopPane={
          <InfoBox campaign={campaign} onMoreInfo={() => console.log('on more info')} />
        }
        barStickyOnContentTopScrolled={true}
        contentPane={
          <DateoTeaserList
            dateos={dateos}
            onLoadMoreDateos={this.onLoadMoreDateos}
            onDateoOpen={campaignView.onOpenDateo}
            showMax={this.state.showMaxDateos}
          />
        }
      />
    );
  }
}
