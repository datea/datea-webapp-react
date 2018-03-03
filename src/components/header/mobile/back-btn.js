import React from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui-icons/ArrowBack';
import {inject} from 'mobx-react';

@inject('store')
export default class BackButton extends React.Component {

  render() {
    const btnStyle ={
      padding: 0,
      margin: 0
    };
    const iconStyle = {
      width  : 32,
      height : 32,
      position: 'relative',
      top : '1px'
    };
    return (
      <IconButton onClick={() => window.history.back()} style={btnStyle}>
        <ArrowBack style={iconStyle} />
      </IconButton>
    )
  }

}
