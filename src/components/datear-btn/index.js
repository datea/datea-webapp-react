import './datear-btn.scss';
import React from 'react';
import {observer, inject} from 'mobx-react';
import Button from '@material-ui/core/Button';
import LocationIcon from '@material-ui/icons/AddLocation';
import {Tr} from '../../i18n';

const DatearBtn = ({store}) =>
  <Button variant="fab" className="datear-btn" onClick={() => store.openDateoForm()}>
    <LocationIcon className="datear-icon" />
    <div className="txt"><Tr id="DATEAR.DATEAR" /></div>
  </Button>

export default inject('store')(observer(DatearBtn));
