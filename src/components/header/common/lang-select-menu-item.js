import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {observer, inject} from 'mobx-react';
import FlagIcon from 'material-ui/svg-icons/content/flag';

const langs = {
  'es' : 'Español',
  'fr' : 'Français'
}

@inject('store')
@observer
export default class MainMenu extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  onLocaleChange = (event, index, value) => this.props.store.user.setLocale(value);

  render() {
    const {store: {user}} = this.props;
    let mItemProps = {};
    if (this.props.mobile) {
      mItemProps.leftIcon = <FlagIcon/>;
    } else {
      mItemProps.rightIcon = <FlagIcon/>;
    }
    return (
      <MenuItem {...mItemProps}>
        <SelectField value={user.locale} onChange={this.onLocaleChange} fullWidth={true}>
          {['es', 'fr'].map(loc =>
            <MenuItem key={loc} value={loc} primaryText={langs[loc]} />
          )}
        </SelectField>
      </MenuItem>
    )
  }
}
