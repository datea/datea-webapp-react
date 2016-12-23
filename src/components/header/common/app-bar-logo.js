import React from 'react';
import UI from '../../../stores/ui';
import IconButton from 'material-ui/IconButton';
import DIcon from '../../../icons';
import {observer} from 'mobx-react';

@observer
export default class AppBarLogo extends React.Component {
  render() {
    const logoSize = UI.isMobile ? 44 * 3/4 : 44;
    return (
      <IconButton
          style={{width: logoSize+'px', height: logoSize+'px', border: 0}}
          {...this.props} >
          <DIcon name="datea-logo" />
      </IconButton>
    )
  }
}
