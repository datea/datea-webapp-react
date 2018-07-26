import './dateo-teaser-list.scss';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Button from '@material-ui/core/Button';
import {Tr} from '../../../i18n';
import DateoTeaser from '../teaser-view';

const DateoTeaserList = ({dateos, onLoadMoreDateos, onDateoOpen, showMax}) =>
    !!dateos && dateos.size ?
    <div className="dateo-teaser-list">
      <h4 className="title">Dateos</h4>
      <div className="dateo-list">
        {[...dateos.values()].slice(0, showMax).map(dateo =>
          <DateoTeaser key={'dateo-'+dateo.id} dateo={dateo} onOpen={onDateoOpen} />
        )}
      </div>
      {dateos.size > showMax &&
        <div className="load-more-action">
          <Button onClick={onLoadMoreDateos}><Tr id="LOAD_MORE_RESULTS" /></Button>
        </div>
      }
    </div>
    : <span />

export default observer(DateoTeaserList);
