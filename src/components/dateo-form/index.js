import React from 'react';
import Button from 'material-ui/Button';
import {observer} from 'mobx-react';
import {t, translatable} from '../../i18n';
import MainDateoForm from './main-form';

@translatable
@observer
export default class DateoForm extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <MainDateoForm />
  }
}
