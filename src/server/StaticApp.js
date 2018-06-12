import React from 'react';
import CssBaseline from 'material-ui/CssBaseline';
import {MuiThemeProvider} from 'material-ui/styles';
import '../bootstrap.js';
import {Provider} from 'mobx-react';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import config from '../config';
import muiTheme from '../theme/mui-theme';
import DateoFormModal from '../components/dateo-form-modal';
import {MarkerDefs} from '../components/marker';
import Shell from '../components/shell';

const App = ({store}) =>
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Provider store={store}>
        <Shell />
      </Provider>
    </MuiThemeProvider>
  </MuiPickersUtilsProvider>

export default App;
