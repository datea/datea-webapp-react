import './image-pane.scss';
import wu from 'wu';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {observer} from 'mobx-react';
import InfiniteScroll from 'react-infinite-scroller';
import InfiniteLoaderIcon from '../../infinite-loader-icon';
import {getImgSrc} from '../../../utils';

@observer
export default class ImagePane extends Component {

  static propTypes = {
    dateos : PropTypes.object,
    onImageClick : PropTypes.func,
    topBar : PropTypes.node
  };

  state = {
    limit : 50
  };

  increaseLimit = () => this.setState({limit: this.state.limit + 50});

  render() {
    const {dateos, onImageClick, topBar} = this.props;
    const {limit} = this.state;
    const maxLoad = dateos.length;
    const images = wu(dateos.values()).map(d => d.images.map(i => ({img: i.image, dateo: d}))).flatten().toArray();
    return (
      <div className="visual-pane-image-grid">
        <div className="top-bar">{topBar}</div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.increaseLimit}
          hasMore={limit < maxLoad}
          loader={<InfiniteLoaderIcon key={0} />}>
            {images.slice(0, limit).map((img,i) =>
              <div key={'i'+i} className="visual-pane-image" style={{backgroundImage: `url(${getImgSrc(img.img)})`}} onClick={() => console.log(img.dateo)}></div>
            )}
        </InfiniteScroll>
      </div>
    );
  }
}
