import React from 'react';
import Polyglot from 'node-polyglot';
import {observable, autorun} from 'mobx';
import {observer} from 'mobx-react';
import es from './locales/locale-es.json';
import fr from './locales/locale-fr.json';
import USER from '../stores/user';

const langPhrases = {es, fr};
const poly = new Polyglot();

/****
 switch language as reaction to lang observable changes.
 **/
autorun(() => {
  poly.locale(USER.locale);
  poly.replace(langPhrases[USER.locale]);
});

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
  return poly.t(id, vars);
}
