import './swipeable-container.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {observer, inject, PropTypes as MobxPropTypes} from 'mobx-react';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import IconButton from 'material-ui/IconButton';
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
    isVisible: PropTypes.bool
  };

  state = {
    slideStyle : {}
  };

  lastIndex = null;

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
    this.props.store.updateQueryParams({dateo: this.indexToDateoId(idx)});
  }

  onClickNav = (currentId, direction) => {
    const dateos = this.props.store.dateo.data.dateos;
    const dateoIds = dateos.keys();
    const idx = dateoIds.indexOf(String(currentId));
    let nextId;
    if (direction == 'next') {
      nextId = dateoIds.length > idx + 1 ? dateoIds[idx + 1] : dateoIds[0];
    } else {
      nextId = idx > 0 ? dateoIds[idx -1] : dateoIds[dateoIds.length - 1];
    }
    this.props.store.openDateo({dateo: nextId});
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
    const {router, ui} = this.props.store;
    const dateoId = router.queryParams && router.queryParams.dateo;
    if (!dateoId) return <span />

    const idx = this.dateoIdToIndex(dateoId);
    let animateTransitions = !this.lastIndex || Math.abs(idx - this.lastIndex) == 1;
    this.lastIndex = idx
    return (
      <div className={cn('dateo-swipeable-container', ui.isMobile && 'mobile')}
          ref={ref => {this.containerRef = ref}}>
        <div className="nav-btn nav-left">
          <IconButton className="dateo-nav-btn" onClick={() => this.onClickNav(dateoId, 'prev')}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div className="nav-btn nav-right">
          <IconButton className="dateo-nav-btn" onClick={() => this.onClickNav(dateoId, 'next')}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <VirtualizeSwipeableViews
          index={idx}
          enableMouseEvents
          animateTransitions={animateTransitions}
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
