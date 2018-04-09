import './profile-head.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import {observer} from 'mobx-react';
import UserAvatar from '../../user-avatar';
import {Tr} from '../../../i18n';

const ProfileHead = ({profile, onEditClick, isMobile}) =>
  <div className={cn('profile-head-container', isMobile && 'mobile')}>
    <div className="profile-head">
      <div className="picture">
        <UserAvatar size={isMobile ? 80: 128} src={profile.largeImage} />
      </div>
      <div className="user-info">
          <div className="username-wrap">
            <div className="username">{profile.data.user.username}</div>
            {!!profile.data.isOwn && !isMobile &&
              <IconButton className="edit-icon" onClick={onEditClick}>
                <EditIcon />
              </IconButton>
            }
          </div>
          {!!profile.data.user.full_name &&
            <div className="fullname">{profile.data.user.full_name}</div>
          }
          {!!profile.data.user.message &&
            <div className="user-msg">{profile.data.user.message}</div>
          }
          <div className="stat-box">
            <div className="stat num-dateos">
              {profile.data.user.dateo_count} <Tr id="DATEOS" />
            </div>
            {!!profile.data.mappingsCreated && !!profile.data.mappingsCreated.length &&
              <div className="stat num-dateos">
                {profile.data.mappingsCreated.length} <Tr id="MAPPINGS" />
              </div>
            }
          </div>
      </div>
    </div>
  </div>

export default observer(ProfileHead);
