import React from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui-icons/ArrowBack';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import {inject} from 'mobx-react';

@inject('store')
export default class BackButton extends React.Component {

  render() {
    return (
      <IconButton onClick={() => window.history.back()}>
        <ChevronLeft className="header-back-btn-icon" />
      </IconButton>
    )
  }

}
