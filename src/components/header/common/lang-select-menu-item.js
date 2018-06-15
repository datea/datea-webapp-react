import React from 'react';
import {MenuItem} from 'material-ui/Menu';
import {ListItemText, ListItemIcon} from 'material-ui/List';
import Select from 'material-ui/Select';
import {observer, inject} from 'mobx-react';
import FlagIcon from 'material-ui-icons/Flag';

const langs = {
  'es' : 'Español',
  'fr' : 'Français'
}

@inject('store')
@observer
export default class LangSelectMenuItem extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  onLocaleChange = (ev) => {
    this.props.store.user.setLocale(ev.target.value);
  }

  render() {
    const {user, ui} = this.props.store;
    return (
      <MenuItem>
        {ui.isMobile && <ListItemIcon><FlagIcon/></ListItemIcon>}
        <ListItemText primary={
          <Select value={user.locale} onChange={this.onLocaleChange} fullWidth={true}>
            {['es', 'fr'].map(loc =>
              <MenuItem key={loc} value={loc}>{langs[loc]}</MenuItem>
            )}
          </Select>
        } />
        {!ui.isMobile && <ListItemIcon><FlagIcon/></ListItemIcon>}
      </MenuItem>
    )
  }
}
