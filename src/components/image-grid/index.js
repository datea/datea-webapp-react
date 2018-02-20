import './image-grid.scss';
import React from 'react';
import {PropTypes as MobxPropTypes} from 'mobx-react';
import cn from 'classnames';
import {getImgSrc} from '../../utils';
import {inject} from 'mobx-react';


const ImageGrid = ({images, className, store}) =>
  <div className={cn('image-grid', className)}>
    {images.map((img, i) =>
      <div key={'img-'+i} className="grid-thumb-wrap">
        <div className="grid-thumb"
          style={{backgroundImage: 'url('+getImgSrc(img.thumb)}}
          onClick={() => store.ui.openSlideshow(images.map(i=>getImgSrc(i.image)), i)}
        />
      </div>
    )}
  </div>

ImageGrid.propTypes = {
  images : MobxPropTypes.arrayOrObservableArray.isRequired
};

export default inject('store')(ImageGrid);
