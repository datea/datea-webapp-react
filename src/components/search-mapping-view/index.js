import './search-mapping-view.scss';
import React from 'react';
import {observer, inject} from 'mobx-react';
import InfiniteScroll from 'react-infinite-scroller';
import InfiniteLoaderIcon from '../infinite-loader-icon';
import Button from 'material-ui/Button';
import MappingColumnLayout from '../mapping-column-layout';
import DIcon from '../../icons';
import {Tr} from '../../i18n';

@inject('store')
@observer
export default class SearchMappingView extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {mappings, numResults, limit, loadMore} = this.props.store.searchMappingView;

    return (
      <div className="search-page-container mapping-column-container">
        <h1><Tr id="SEARCHBOX.GLOBAL_PH" /></h1>
        {!this.props.store.ui.loading &&
          (numResults > 0
            ? <div className="num-results">
              {numResults} <Tr id="CAMPAIGNS.RESULTS" />
              </div>
            : <div className="no-results">
              <DIcon name="daterito2" />
              <div className="txt">
                <Tr id="SEARCH_PAGE.NO_RESULTS" />. <Tr id="ERROR.RETRY" />
              </div>
            </div>
          )
        }
        {!!mappings.length &&
          <div className="mappings">
            <div className="mapping-group">
              <InfiniteScroll
                pageStart={0}
                loadMore={loadMore}
                hasMore={numResults > limit}
                loader={<InfiniteLoaderIcon key={0} />}>
                  <MappingColumnLayout mappings={mappings} />
                </InfiniteScroll>
            </div>
          </div>
        }
      </div>
    )
  }
}
