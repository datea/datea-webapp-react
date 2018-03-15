import React from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui-icons/ArrowBack';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import {inject} from 'mobx-react';

@inject('store')
export default class BackButton extends React.Component {

  render() {
    const btnStyle ={
      padding: 0,
      margin: 0
    };
    const iconStyle = {
      width  : 38,
      height : 38,
      position: 'relative',
      top : '1px'
    };
    return (
      <IconButton onClick={() => window.history.back()} style={btnStyle}>
        <ChevronLeft style={iconStyle} />
      </IconButton>
    )
  }

}
