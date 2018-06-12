import './author-header.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Link from '../link';
import UserAvatar from '../user-avatar';

const AuthorHeader = ({user, subTitle, className}) =>
  <div className={cn('author-header', className)}>
    <div className="avatar-holder">
      <Link route="profile" params={{username: user.username}}>
        <UserAvatar src={user.image} size={44} />
      </Link>
    </div>
    <div className="author-info">
      <div className="uname">
        <Link route="profile" params={{username: user.username}}>{user.username}</Link>
      </div>
      {!!subTitle && <div className="sub-title">{subTitle}</div>}
    </div>
  </div>;

AuthorHeader.propTypes = {
  user      : PropTypes.object.isRequired,
  subTitle  : PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className : PropTypes.string
};

export default AuthorHeader;
