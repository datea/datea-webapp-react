import './infinite-loader-icon.scss';
import React from 'react';
import { CircularProgress } from 'material-ui/Progress';

const InfiniteLoaderIcon = () =>
  <div className="infinite-loader-icon" key={0}>
    <CircularProgress size={30} style={{color: '#999'}} />
  </div>

export default InfiniteLoaderIcon;
