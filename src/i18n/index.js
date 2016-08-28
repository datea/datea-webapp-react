import React from 'react';
import Polyglot from 'node-polyglot';
import {observable, autorun} from 'mobx';
import {observer} from 'mobx-react';
import es from './locales/locale-es.json';
import fr from './locales/locale-fr.json';

const defaultLang = 'es';
const availableLangs = ['es', 'fr'];
const langPhrases = {es, fr};

const poly = new Polyglot();

// find out currentLang
let currentLang = navigator.language.split('-')[0].toLowerCase();
if (availableLangs.indexOf(currentLang) == -1) {
  currentLang = defaultLang;
}

// The lang observable
let lang = observable({locale: currentLang});

/****
 switch language as reaction to lang observable changes.
 **/
autorun(() => {
  poly.locale(lang.locale);
  poly.replace(langPhrases[lang.locale]);
});

/***
 decorator to trigger rerender with mobx
 when translation changed
 **/
@observer
export function translatable(Component) {
  return class Translatable extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.lang = lang;
    }

    render() {
      return <Component {...this.props} lang={this.lang.locale} />;
    }
  }
}

/***
current language observable
***/
export {lang};

/***
string translation function
**/
export function t(id, vars) {
  return poly.t(id, vars);
}
