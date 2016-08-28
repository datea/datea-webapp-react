
const getRootElementFontSize = () => {
    // Returns a number
    return parseFloat(
        // of the computed font-size, so in px
        getComputedStyle(
            // for the root <html> element
            document.documentElement
        )
        .fontSize
    );
}

// Convert Rem units to px
export default function rem2px(value) {
  return value * getRootElementFontSize();
}
