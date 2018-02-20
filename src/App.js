import './scss/app-main.scss';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Provider} from 'mobx-react';
import {MobxRouter, startRouter} from 'mobx-router';
import DateaStore from './state/store';
import RouteConfig from './state/views';
import config from './config';
import Main from './components/main';
import muiTheme from './theme/mui-theme';

injectTapEventPlugin();

const store = new DateaStore();
startRouter(RouteConfig, store);

const App = () =>
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Main>
        <MobxRouter />
      </Main>
    </Provider>
  </MuiThemeProvider>

export default App;
