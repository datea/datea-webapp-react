import React from 'react';
import Polyglot from 'node-polyglot';
import {observer} from 'mobx-react';
import es from './locales/locale-es.json';
import fr from './locales/locale-fr.json';
import USER from '../stores/user';
import {getCurrentLocale} from './utils';

const langPhrases = {es, fr};
const poly = new Polyglot();

/****
 set/switch language
 **/
export function setLanguageFile(loc) {
  if (loc != poly.currentLocale) {
    poly.locale(loc);
    poly.replace(langPhrases[loc]);
  }
};
setLanguageFile(getCurrentLocale());

/***
 decorator to trigger rerender with mobx
 when translation changed
 **/
@observer
export function translatable(Component) {
  return class Translatable extends React.Component {
    render() {
      return <Component {...this.props} lang={USER.locale} />;
    }
  }
}

/***
string translation function
**/
export function t(id, vars) {
  setLanguageFile(USER.locale);
  return poly.t(id, vars);
}
