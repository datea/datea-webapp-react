import React from 'react';
import Lightbox from 'react-image-lightbox';
import {observer, inject} from 'mobx-react';
import {toJS} from 'mobx';
import qs from 'qs';

@inject('store')
@observer
export default class Slideshow extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentWillReact() {
    const {store} = this.props;
    const {router} = store;
    const queryParams = toJS(router.queryParams);
    if (!!store.ui.modals.slideshow && !queryParams.slideshow) {
      queryParams.slideshow = 'open';
      router.goTo(router.currentView, router.params, store, queryParams);
    } else if (this.slideshowOpen) {
      this.props.store.ui.closeSlideShow();
    }
  }

  closeSlideShow = () => {
    const {router} = this.props.store;
    if (router.queryParams.slideshow) {
      let qParams = toJS(router.queryParams);
      delete qParams.slideshow;
      router.goTo(router.currentView, router.params, this.props.store, queryParams);
    }
  }

  render() {
    const {ui} = this.props.store;
    this.slideshowOpen == !!ui.modals.slideshow;
    if (!ui.modals.slideshow) return null;
    const index = ui.modals.slideshow.index;
    const images = toJS(ui.modals.slideshow.images);
    return (
      <Lightbox
        mainSrc={images[index]}
        prevSrc={images.length > 1 ? images[(index - 1) % images.length] : undefined}
        nextSrc={images.length > 1 ? images[(index + 1) % images.length] : undefined}
        onMovePrevRequest={() => ui.setSlideIndex((index - 1) % images.length)}
        onMoveNextRequest={() => ui.setSlideIndex((index + 1) % images.length)}
        onCloseRequest={this.closeSlideShow}
        reactModalStyle={{overlay: {zIndex: 10000}}}
      />
    )
  }
}
