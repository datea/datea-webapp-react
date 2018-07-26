import './dropzone-button.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Button from '@material-ui/core/Button';
import AddPhotoIcon from '@material-ui/icons/PhotoCamera';
import AttachFile from '@material-ui/icons/AttachFile';
import CircularProgress from '@material-ui/core/CircularProgress';
import {colors} from '../../../theme/vars';


const DropzoneButton = ({className, type, uploading, disabled, onClick, progress}) =>
  <div className={cn(
      'dropzone-btn',
      uploading && 'uploading',
      disabled && 'disabled',
      type,
      className
  )}>
    {!uploading &&
      <Button
        className="dropzone-btn-elem"
        variant="fab"
        style={{boxShadow: 'none'}}
        disabled={disabled}
        onClick={onClick}
        >
        {type == 'image'
          ? <AddPhotoIcon className={cn('dropzone-btn-icon', type)} />
          : <AttachFile className={cn('dropzone-btn-icon', type)} />
        }
      </Button>
    }
    {!!uploading &&
      <div className="dropzone-progress-container">
        <div className="dropzone-position-wrap">
          <CircularProgress style={{color: 'white'}} size={44} variant="static" value={progress} />
        </div>
      </div>
    }
  </div>

DropzoneButton.propTypes = {
  className: PropTypes.string,
  type : PropTypes.oneOf(['image', 'file']),
  uploading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  progress: PropTypes.number
};

DropzoneButton.defaultProps = {
  type: 'image',
  uploading : false,
  disabled : false
};

export default DropzoneButton;
