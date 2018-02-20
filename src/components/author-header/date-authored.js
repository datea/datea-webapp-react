import React from 'react';
import {observer, inject} from 'mobx-react';
import {dateAuthored} from '../../utils/formats.js';

const DateAuthored = ({date, store}) =>
  <span className="date-authored">{dateAuthored(date, store.user.locale)}</span>

export default inject('store')(observer(DateAuthored))
