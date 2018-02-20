import './file-view.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import config from '../../config';
import {getImgSrc} from '../../utils';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment';

const FileView = ({model}) => {
  const filename = _.last(model.file.split('/'));
  const withTitle = !!model.title && model.title != filename;
  return (
    <a className={cn('file-view', withTitle && 'with-title')} href={getImgSrc(model.file)} download>
      <AttachmentIcon className="file-icon" style={{width: '40px', height: '40px'}} />
      {withTitle && <div className="file-title" >{model.title}</div>}
      <div className="file-name">{filename}</div>
    </a>
  )
}

FileView.propTypes = {
  model: PropTypes.object.isRequired
};

export default FileView;
