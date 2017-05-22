import './mapping-column-layout.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import MappingCard from '../mapping-card';

const MappingColumnLayout = ({items}) =>
  <div className="mapping-column-layout">
    {items.map((item, i) =>
      <div className="mapping-column-item" key={'m-'+i}>
        <MappingCard mapping={item} />
      </div>
    )}
  </div>

export default MappingColumnLayout;
