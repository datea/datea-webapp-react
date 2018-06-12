import '../scss/app-main.scss';
import 'typeface-roboto';
import React from 'react';
import CssBaseline from 'material-ui/CssBaseline';
import {MuiThemeProvider} from 'material-ui/styles';
import '../bootstrap.js';
import {Provider} from 'mobx-react';
import history from '../state/history';
import {HistoryAdapter} from 'mobx-state-router';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateaStore from '../state/store';
import muiTheme from '../theme/mui-theme';
import Shell from '../components/shell';

const store = new DateaStore();

// Observe history changes
const historyAdapter = new HistoryAdapter(store.router, history);
historyAdapter.observeRouterStateChanges();

const App = () =>
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Provider store={store}>
        <Shell />
      </Provider>
    </MuiThemeProvider>
  </MuiPickersUtilsProvider>

export default App;
