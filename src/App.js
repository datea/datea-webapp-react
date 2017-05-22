import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import config from './config';
import Main from './components/main';

import muiTheme from './theme/mui-theme.js';

import './scss/main.scss';

injectTapEventPlugin();

const App = () =>
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router>
      <Route path="/" component={Main} />
    </Router>
  </MuiThemeProvider>

export default App;
