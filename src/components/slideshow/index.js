import React from 'react';
import Lightbox from 'react-image-lightbox';
import {observer, inject} from 'mobx-react';
import 'react-image-lightbox/style.css';

const SlideShow = ({store}) => {
  const {ui} = store;
  if (!ui.modals.slideshow) return null;
  const index = ui.modals.slideshow.index;
  const images = ui.modals.slideshow.images;
  return (
    <Lightbox
      mainSrc={images[index]}
      prevSrc={images.length > 1 ? images[(index - 1) % images.length] : undefined}
      nextSrc={images.length > 1 ? images[(index + 1) % images.length] : undefined}
      onMovePrevRequest={() => ui.setSlideIndex((index - 1) % images.length)}
      onMoveNextRequest={() => ui.setSlideIndex((index + 1) % images.length)}
      onCloseRequest={ui.closeSlideShow}
      reactModalStyle={{overlay: {zIndex: 10000}}}
    />
  )
}

export default inject('store')(observer(SlideShow));
