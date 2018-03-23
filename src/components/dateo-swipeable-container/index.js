import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject, PropTypes as MobxPropTypes} from 'mobx-react';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import {DateoDetail} from '../dateo';


const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const dateoRenderer = ({index, store}) => {
  const dateos = store.dateo.data.dateos;
  const dateoId = dateos.keys()[index];
  if (!dateos.get(dateoId)) {
    return <span>loading...</span>
  }else{
    return <DateoDetail dateo={dateos.get(dateoId)} />
  }
}
const DateoRenderer = inject('store')(observer(dateoRenderer));

@inject('store')
@observer
export default class DateoSwipeableContainer extends Component {

  static propTypes = {
    dateoId : PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    onSlideChange : PropTypes.func,
    isVisible: PropTypes.bool
  };

  state = {
    slideStyle : {}
  };

  dateoIdToIndex = (id) => {
    if (id) {
      let idx = this.props.store.dateo.data.dateos.keys().indexOf(String(id));
      return idx != -1 ? idx : 0;
    }else{
      return 0;
    }
  }
  indexToDateoId = (idx) => this.props.store.dateo.data.dateos.keys()[idx]

  onChangeIndex = (idx) => {
    !!this.props.onSlideChange && this.props.onSlideChange(this.indexToDateoId(idx))
  }

  componentDidMount() {
    this.updateSlideMinHeight();
    window.addEventListener('resize', this.updateSlideMinHeight);
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.isVisible && !this.props.isVisible) {
      setTimeout(()=> this.updateSlideMinHeight() , 500);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSlideMinHeight);
  }


  updateSlideMinHeight = () => {
    // am I in map layout / .content-area?
    const contentArea = this.containerRef.closest('.content-area');
    if (contentArea) {
      const minSlideHeight = contentArea.offsetHeight - this.containerRef.offsetTop - 15;
      this.setState({slideStyle: {minHeight: `${minSlideHeight}px`}});
    }
  }

  render() {
    const idx = this.dateoIdToIndex(this.props.dateoId);
    return (
      <div className="dateo-swipeable-container" ref={ref => {this.containerRef = ref}}>
        <VirtualizeSwipeableViews
          index={idx}
          enableMouseEvents
          resistance
          animateHeight
          action={cs => {this.swipeableCallbacks = cs}}
          slideRenderer={({index, key}) =>
            <div key={key} className="scrollable-slide" style={this.state.slideStyle}>
              <DateoRenderer index={index} />
            </div>
          }
          onChangeIndex={this.onChangeIndex}
        />
      </div>
    );
  }
}
