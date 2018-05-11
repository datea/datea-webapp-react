import React from 'react';
import CssBaseline from 'material-ui/CssBaseline';
import {MuiThemeProvider} from 'material-ui/styles';
import '../bootstrap.js';
import {Provider} from 'mobx-react';
import {MobxRouter, startRouter} from '../mobx-router';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import config from '../config';
import Main from '../components/main';
import muiTheme from '../theme/mui-theme';
import DateoFormModal from '../components/dateo-form-modal';
import HeadMeta from '../components/head-meta';
import {MarkerDefs} from '../components/marker';

const App = ({store}) =>
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Provider store={store}>
        <Main>
          <HeadMeta />
          <MobxRouter />
        </Main>
      </Provider>
    </MuiThemeProvider>
  </MuiPickersUtilsProvider>

export default App;
