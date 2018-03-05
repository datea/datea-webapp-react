import React from 'react';
import PropTypes from 'prop-types';
import Polyglot from 'node-polyglot';
import {observer, inject} from 'mobx-react';
import es from './locales/locale-es.json';
import fr from './locales/locale-fr.json';
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
export function translatable(Component) {
  @inject('store')
  @observer
  class Translatable extends React.Component {
    render() {
      return <Component {...this.props} lang={this.props.store.user.locale} />;
    }
  }
  return Translatable;
}

/***
string translation function
**/
export function t(id, vars) {
  return poly.t(id, vars);
}


@translatable
export class Tr extends React.Component {

  static propTypes = {
      id  : PropTypes.string.isRequired,
      vars : PropTypes.object
  };

  render() {
    return t(this.props.id, this.props.vars);
  }
}
