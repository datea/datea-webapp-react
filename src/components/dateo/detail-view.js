import React from 'react';
import Author from './author';
import Tags from './tags';
import FileView from '../file-view';
import ImageGrid from '../image-grid';
import {renderContentWithUrls} from './utils';

const DetailView = ({dateo}) =>
  <div className="dateo dateo-detail">
    <Author dateo={dateo} />
    <Tags tags={dateo.tags} />
    <div className="content">{renderContentWithUrls(dateo.content, true)}</div>

    {!!dateo.images && !!dateo.images.length &&
      <ImageGrid images={dateo.images} />
    }

    {!!dateo.files && !!dateo.files.length &&
      <div className="files">
        {dateo.files.map(file => <FileView key={file.id} model={file} />)}
      </div>
    }
  </div>

export default DetailView;
