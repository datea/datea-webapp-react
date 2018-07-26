import React from 'react';
import Author from './author';
import Tags from './tags';
import FileView from '../file-view';
import {observer, inject} from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ImageGrid from '../image-grid';
import {renderContentWithUrls} from './utils';


const DetailView = ({dateo, store}) =>
  <div className="dateo dateo-detail">
    {store.user.isEditable(dateo) &&
        <IconButton
          className="edit-btn"
          onClick={() => store.updateQueryParams({datear: dateo.id}, false)}>
          <EditIcon />
        </IconButton>
    }
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

export default inject('store')(observer(DetailView));
