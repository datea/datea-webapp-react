import React from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui-icons/ArrowBack';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import {inject, observer} from 'mobx-react';
import DIcon from '../../../icons';

const BackButton = ({store}) =>
  <IconButton className="back-btn" onClick={() => store.backButton.goBack()}>
    {store.backButton.showBackButton
      ? <ChevronLeft className="header-back-btn-icon" />
      : <DIcon name="datea-logo" />
    }
  </IconButton>

export default inject('store')(observer(BackButton))
