import './campaign-manager-view.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import CampaignForm from '../campaign-form';
import {Tr} from '../../i18n';

const CampaignManagerView = props =>
  <div className="campaign-manager-view">
    <Paper className="manager-paper">
      <CampaignForm />
    </Paper>
  </div>

export default CampaignManagerView;
