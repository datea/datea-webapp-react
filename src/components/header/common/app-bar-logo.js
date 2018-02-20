import React from 'react';
import IconButton from 'material-ui/IconButton';
import DIcon from '../../../icons';
import {observer, inject} from 'mobx-react';

@inject('store')
@observer
export default class AppBarLogo extends React.Component {
  render() {
    const logoSize = this.props.store.ui.isMobile ? 44 * 3/4 : 44;
    const {store, ...otherProps} = this.props;
    return (
      <IconButton
          style={{width: logoSize+'px', height: logoSize+'px', border: 0}}
          {...otherProps} >
          <DIcon name="datea-logo" />
      </IconButton>
    )
  }
}
