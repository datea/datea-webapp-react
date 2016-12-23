import React from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

export default class BackButton extends React.Component {

  static contextTypes = {
    router : React.PropTypes.object
  };

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
      <IconButton onTouchTap={() => this.context.router.goBack()} style={btnStyle} iconStyle={iconStyle}>
        <ArrowBack />
      </IconButton>
    )
  }

}
