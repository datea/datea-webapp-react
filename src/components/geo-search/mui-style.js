
const ITEM_HEIGHT = 48;
const INPUT_PAD_LEFT = '36px';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select.search-input' : {
      backgroundColor : 'rgba(255,255,255,0.8)',
      '&.focused' : {
        backgroundColor : 'white',
      }
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
      paddingLeft: INPUT_PAD_LEFT,
    },
    '.Select.is-focused > .Select-control, .Select.is-focused:not(.is-open) > .Select-control': {
      background: 'transparent !important'
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      paddingLeft: INPUT_PAD_LEFT,
      height: '32px',
      //minHeight: ITEM_HEIGHT,
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      lineHeight: '32px',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: INPUT_PAD_LEFT,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
    },
    '.Select-value' : {
      marginRight: '30px !important',
      overflow : 'hidden',
      textOverflow: 'ellipsis',
    },
    '.Select-value .Select-value-label' : {
      display : 'block',
      whiteSpace: 'nowrap',
      overflow : 'hidden',
      textOverflow: 'ellipsis',
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100%)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 23,
      zIndex: 1,
      marginRight: 10
    },
    '.Select-loading-zone' : {
      width: 26
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
  },
});

export default styles;
