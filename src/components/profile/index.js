import './profile.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {inject, observer} from 'mobx-react';
import Button from '@material-ui/core/Button';
import MappingColumnLayout from '../mapping-column-layout';
import {Tr} from '../../i18n';
import ProfileHead from './profile-head';

@inject('store')
@observer
export default class Profile extends Component {

  onEditProfile = ev => {
    this.props.store.router.goTo('settings', {page: 'profile'});
  }

  onCreateMapping = ev => {
    this.props.store.router.goTo('campaignForm', {id: 'new'});
  }

  render() {
    const {profileView : profile, ui} = this.props.store;
    if (!profile) return <span />
    return (
      <div className="profile">
        <ProfileHead profile={profile} onEditClick={this.onEditProfile} isMobile={ui.isMobile} />
        <div className="profile-content mapping-column-container">
          <div className="mappings">
            <div className="mapping-group">
              <Button className="create-mapping-btn" onClick={this.onCreateMapping}>Crear Mapeo</Button>
              <h3 className="profile-content-title"><Tr id="MY_MAPPINGS" /></h3>
              <MappingColumnLayout mappings={profile.mappings} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
