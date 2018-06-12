import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import _ from 'lodash';
import { Link, RouterState } from 'mobx-state-router';

const DateaLink = ({store, route, params, queryParams, children, ...otherProps}) => {
  let toState;
  if (typeof(route) == 'string') {
    toState = new RouterState(route, params, queryParams);
  } else {
    toState = new RouterState(route);
  }
  let routeExists = _.find(store.router.routes, r => r.name == toState.routeName);
  if (routeExists) {
    return <Link routerStore={store.router} toState={toState} {...otherProps}>{children}</Link>;
  } else {
    return <span className="dummy-route">{children}</span>
  }
}

DateaLink.propTypes = {
  store: PropTypes.object.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  params : PropTypes.object,
  queryParams: PropTypes.object,
  className: PropTypes.string,
  activeClassName : PropTypes.string,
  children: PropTypes.node
};

export default inject('store')(DateaLink);
