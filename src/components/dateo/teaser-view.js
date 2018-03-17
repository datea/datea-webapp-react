import React from 'react';
import Author from './author';
import Tags from './tags';
import FileView from '../file-view';
import ImageGrid from '../image-grid';
import Button from 'material-ui/Button';
import {Tr} from '../../i18n';
import {renderContentWithUrls} from './utils';

const TeaserView = ({dateo, onOpen}) =>
  <div className="dateo dateo-teaser">
    <Author dateo={dateo} />
    <Tags tags={dateo.tags} />
    <div className="content">{renderContentWithUrls(dateo.extract, true)}</div>
    {!!dateo.images && !!dateo.images.length && <ImageGrid images={dateo.images} size="small" />}
    {!!onOpen &&
      <div className="actions">
        <Button onClick={() => onOpen(dateo)}><Tr id="SHOW_DETAIL" /></Button>
      </div>
    }
  </div>

export default TeaserView;
