import './app-bar.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import {colors} from '../../theme/vars';

const DateaAppBar = ({store, className, children, colorName, position, ...props}) =>
  <AppBar
    position={position}
    className={cn('datea-app-bar', store.ui.isMobile ? 'mobile' : 'normal', className)}
    style={Object.assign({}, props.style || {}, {backgroundColor: colors[colorName]})}
    {...props}>
    <Toolbar className="datea-app-bar-toolbar">
      {children}
    </Toolbar>
  </AppBar>

DateaAppBar.propTypes = {
  className: PropTypes.string,
  children : PropTypes.node,
  colorName: PropTypes.string,
  position: PropTypes.string
};

DateaAppBar.defaultProps = {
  colorName: 'yellow',
  position: 'static'
};

export default inject('store')(observer(DateaAppBar));
