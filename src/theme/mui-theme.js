import { createMuiTheme } from '@material-ui/core/styles';
import {colors} from './vars';
import Color from 'color';

const theme = {
  palette : {
    primary : {
      light   : Color(colors.green).lighten(0.2).string(),
      main    : colors.green,
      dark    : Color(colors.green).darken(0.3).string()
    },
    secondary : {
      light   : Color(colors.purple).lighten(0.2).string(),
      main    : colors.purple,
      dark    : Color(colors.purple).lighten(0.3).string(),
      pickerHeaderColor : '#999999'
    }
  }
};

/*appBar: {
  color: colors.yellow,
  textColor: 'black'
},

tabs : {
  backgroundColor : 'transparent',
  selectedTextColor : 'rgba(0, 0, 0, 0.87)',
  textColor: 'rgba(0, 0, 0, 0.4)'
}*/

export default createMuiTheme(theme);
