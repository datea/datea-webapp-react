
const getRootElementFontSize = () => {
    // Returns a number
    if (ENV_TYPE == 'browser') {
      return parseFloat(
          // of the computed font-size, so in px
          getComputedStyle(
              // for the root <html> element
              document.documentElement
          )
          .fontSize
      );
    } else {
      return 16;
    }
}

// Convert Rem units to px
export default function rem2px(value) {
  return value * getRootElementFontSize();
}
