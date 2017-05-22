import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {colors} from './vars';
import Color from 'color';

const theme = {
  appBar: {
    color: colors.yellow,
    textColor: 'black'
  },
  palette : {
    primary1Color     : 'rgba(0, 0, 0, 0.87)',
    primary2Color     : colors.green,
    primary3Color     : Color(colors.green).darken(0.3).string(),
    accent1Color      : colors.purple,
    pickerHeaderColor : '#999999'
  },
  raisedButton : {
    primaryColor: colors.green,
  },
  tabs : {
    backgroundColor : 'transparent',
    selectedTextColor : 'rgba(0, 0, 0, 0.87)',
    textColor: 'rgba(0, 0, 0, 0.4)'
  }
};

export default getMuiTheme(theme);
