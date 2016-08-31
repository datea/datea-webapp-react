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
    primary3Color     : Color(colors.green).darken(0.3).hexString(),
    accent1Color      : colors.purple,
    pickerHeaderColor : '#999999'
  },
  raisedButton : {
    primaryColor: colors.green,
  }
};

console.log(getMuiTheme(theme));

export default getMuiTheme(theme);
