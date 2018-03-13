import './scss/app-main.scss';
import 'typeface-roboto';
import React from 'react';
import Reboot from 'material-ui/Reboot';
import {MuiThemeProvider} from 'material-ui/styles';
import './bootstrap.js';
import {Provider} from 'mobx-react';
import {MobxRouter, startRouter} from 'mobx-router';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateaStore from './state/store';
import RouteConfig from './state/views';
import config from './config';
import Main from './components/main';
import muiTheme from './theme/mui-theme';

const store = new DateaStore();
startRouter(RouteConfig, store);

const App = () =>
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <MuiThemeProvider theme={muiTheme}>
      <Reboot />
      <Provider store={store}>
        <Main>
          <MobxRouter />
        </Main>
      </Provider>
    </MuiThemeProvider>
  </MuiPickersUtilsProvider>

export default App;
