import React from 'react';
import PropTypes from 'prop-types';
import {AuthorHeader, DateAuthored} from '../author-header';
import Link from '../link';

const Author = ({dateo}) =>
  <AuthorHeader
    user={dateo.user}
    subTitle={
      <Link view="dateo" params={{dateoId: dateo.id}}>
        <DateAuthored date={dateo.created} />
      </Link>
    }
  />

Author.propTypes = {
  dateo: PropTypes.object.isRequired
};

export default Author;
