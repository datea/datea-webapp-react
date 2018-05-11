import config from '../config';
import qs from 'qs';

export function getCurrentLocale() {
  // find out currentLang
  if (ENV_TYPE == 'browser') {
    if (document.location.search) {
      const params = qs.parse(document.location.search.replace('?', ''));
      if (params.lang && config.locales.includes(params.lang)) {
        return params.lang;
      }
    }
    if (localStorage.getItem('locale')) {
      return localStorage.getItem('locale');
    }else{
      let currLoc = navigator.language.split('-')[0].toLowerCase();
      if (['es', 'fr'].indexOf(currLoc) == -1) {
        currLoc = config.defaultLocale;
      }
      return currLoc;
    }
  } else {
    return global.lang || config.defaultLocale;
  }
}
