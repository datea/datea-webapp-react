import config from '../config';

export function getCurrentLocale() {
  // find out currentLang
  if (localStorage.getItem('locale')) {
    return localStorage.getItem('locale');
  }else{
    let currLoc = navigator.language.split('-')[0].toLowerCase();
    if (['es', 'fr'].indexOf(currLoc) == -1) {
      currLoc = config.defaultLocale;
    }
    return currLoc;
  }
}
