import './mapping-column-layout.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import MappingCard from '../mapping-card';

const MappingColumnLayout = observer(({mappings}) =>
  <div className="mapping-column-layout">
    {!!mappings && mappings.map((item, i) =>
      <div className="mapping-column-item" key={'m-'+i}>
        <MappingCard mapping={item} />
      </div>
    )}
  </div>
)

export default MappingColumnLayout;
