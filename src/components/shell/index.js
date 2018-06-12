import React from 'react';
import {inject} from 'mobx-react';
import {RouterView} from 'mobx-state-router';
import Main from '../main';
import HeadMeta from '../head-meta';
import DateoFormModal from '../dateo-form-modal';
import {MarkerDefs} from '../marker';
import ViewMap from './viewMap';

const Shell = ({store}) =>
  <Main>
    <HeadMeta />
    <RouterView routerStore={store.router} viewMap={ViewMap} />
    <DateoFormModal />
    <svg height="0" width="0" style={{padding:0, margin: 0, position: 'absolute'}}>
      <MarkerDefs />
    </svg>
  </Main>

export default inject('store')(Shell);
