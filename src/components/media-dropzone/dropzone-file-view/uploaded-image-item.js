import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {GridListTile, GridListTileBar} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import {getImgSrc} from '../../../utils';

const UploadedImage = ({imgResource, index, onDelete, className, ...props}) => {
  return (
    <GridListTile className={cn('uploaded-image-grid-item', className)} {...props}>
      <img src={getImgSrc(imgResource.image)} alt={'image'} />
      <GridListTileBar
          titlePosition={'bottom'}
          actionPosition={'right'}
          actionIcon={
            <IconButton style={{color: 'white'}} onClick={() => !!onDelete && onDelete(imgResource)}>
              <DeleteIcon />
            </IconButton>
          }
        />
    </GridListTile>
  );
}


export default UploadedImage;
