import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'mobx-router';
import {inject} from 'mobx-react';
import Views from '../../Views';

const DateaLink = ({view, params, queryParams, store, children, title, className, style}) => {
  if (!Views[view]) return <a href={view}>[nr] {children}</a>;
  return (
    <Link view={Views[view]}
      params={params}
      queryParams={queryParams}
      store={store}
      className={className}
      style={style}
      title={title}>
        {children}
    </Link>
  );
}
DateaLink.propTypes = {
  view: PropTypes.string,
  params : PropTypes.object,
  queryParams : PropTypes.object,
  store: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  style : PropTypes.object,
  title: PropTypes.node
};

export default inject('store')(DateaLink);
