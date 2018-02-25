import './dateo-teaser-list.scss';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import RaisedButton from 'material-ui/RaisedButton';
import {Tr} from '../../../i18n';
import DateoTeaser from '../teaser-view';

const DateoTeaserList = ({dateos, onLoadMoreDateos, onDateoOpen, showMax}) =>
  <div className="dateo-teaser-list">
    <h4>Dateos</h4>
    <div className="dateo-list">
      {!!dateos && dateos.values().slice(0, showMax).map(dateo =>
        <DateoTeaser key={'dateo-'+dateo.id} dateo={dateo} onOpen={onDateoOpen} />
      )}
    </div>
    <div className="load-more-action">
      <RaisedButton onTouchTap={onLoadMoreDateos}><Tr id="LOAD_MORE_RESULTS" /></RaisedButton>
    </div>
  </div>

export default observer(DateoTeaserList);
