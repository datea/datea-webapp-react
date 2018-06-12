import './home.scss';
import React from 'react';
import {observer, inject} from 'mobx-react';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import DIcon from '../../icons';
import InfiniteLoaderIcon from '../infinite-loader-icon';
import MappingColumnLayout from '../mapping-column-layout';
import Button from 'material-ui/Button';
import Link from '../link';
import {Tr} from '../../i18n';

@inject('store')
@observer
export default class HomePage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.welcomeIcon = _.sample(['daterito1', 'daterito3', 'daterito4']);
  }

  render() {
    const {mappings, mappingsFollowed, loadMore, maxLoad, limit, numResults} = this.props.store.homeView;

    return (
      <div className="home-page-container">
        <div className="home-header">
          <div className="content-container">
            <h1 className="home-title">
              <DIcon name={this.welcomeIcon} />
              <div className="welcome-msg"><Tr id="HOME.WELCOME" /> <span className="strong">{this.props.store.user.data.username}</span>!</div>
            </h1>
            <div className="subtitle"><Tr id="HOME.WELCOME_SUB1" /> <Link route="campaignForm" params={{id: 'new'}}><Tr id="HOME.WELCOME_SUB2" /></Link>.</div>
            <div className="actions">
              <Button variant="flat"
                onClick={() => this.props.store.router.goTo('profile', {username: this.props.store.user.data.username})}
              >IR A MI PERFIL</Button>
            </div>
          </div>
        </div>

        <div className="mapping-column-container">
          <div className="mappings">

            {!!mappingsFollowed.length &&
              <div className="mapping-group">
                <h3><Tr id="SEARCHBOX.MAPPINGS_I_FOLLOW" /></h3>
                <MappingColumnLayout mappings={mappingsFollowed} />
              </div>
            }
            {!!mappings.length &&
              <div className="mapping-group">
                <h3><Tr id="MAPPINGS_HIGHLIGHTED" /></h3>
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={limit < maxLoad && limit < numResults}
                    loader={<InfiniteLoaderIcon key={0} />}>
                      <MappingColumnLayout mappings={mappings} />
                  </InfiniteScroll>
              </div>
            }
            {!mappings.length &&
              <p>No hay mapeos en la plataforma</p>
            }
          </div>
        </div>
      </div>
    )
  }
}
