import './image-grid.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypes as MobxPropTypes} from 'mobx-react';
import cn from 'classnames';
import {getImgSrc} from '../../utils';
import {inject} from 'mobx-react';


const ImageGrid = ({images, className, store, size}) =>
  <div className={cn('image-grid', className, `${size}-grid`)}>
    {images.map((img, i) =>
      <div key={'img-'+i} className="grid-thumb-wrap">
        <div className="grid-thumb"
          style={{backgroundImage: 'url('+getImgSrc(img.thumb)+')'}}
          onClick={() => store.ui.openSlideshow(images.map(i=>getImgSrc(i.image)), i)}
        />
      </div>
    )}
  </div>

ImageGrid.propTypes = {
  images : MobxPropTypes.arrayOrObservableArray.isRequired,
  size: PropTypes.oneOf(['small', 'large'])
};

ImageGrid.defaultProps = {
  size: 'large'
};

export default inject('store')(ImageGrid);
