import getMuiTheme from 'material-ui/styles/getMuiTheme';

// colors
const dateaYellow = '#EDFF00';
const primaryGreen  = '#28BC45';

const theme = {
  appBar: {
    color: dateaYellow,
    textColor: 'black'
  }
};

console.log(getMuiTheme(theme));

export default getMuiTheme(theme);
