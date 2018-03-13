import './dateo-form.scss';
import React from 'react';
import cn from 'classnames';
import Button from 'material-ui/Button';
import {observer, inject} from 'mobx-react';
import EditIcon from 'material-ui-icons/Edit';
import ChevronUpIcon from 'material-ui-icons/KeyboardArrowUp';
import DoneIcon from 'material-ui-icons/Done';
import ButtonBase from 'material-ui/ButtonBase';
import {t, translatable} from '../../i18n';
import MainDateoForm from './main-form';
import MappingLayout from '../mapping-layout';
import DateaResizableMap from '../map';
import GeoSearch from '../geo-search';

@inject('store')
@translatable
@observer
export default class DateoForm extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const form = this.props.store.dateoForm;

    const visualPane = (
      <div className={cn('visual-area-dateo-form', `mode-${form.layoutMode}`)}>
        {form.layoutMode == 'visual' &&
          <GeoSearch
            address={form.dateo.get('address')}
            className="visual-search-field geo-search"
            onSelect={form.receiveGeocodeResult} />
        }
        <div className="map-container">
          <DateaResizableMap
            className="input-map"
            mapStore={form.map} />
        </div>
        {form.layoutMode == 'content' &&
          <div className="address-box">
            <div className="address-content">{form.dateo.get('address')}</div>
            <div className="icon-content">
              <EditIcon />
            </div>
          </div>
        }
      </div>
    );

    return (
      <MappingLayout
        className="dateo-form-layout mapping-with-input"
        onOpenVisualClick={() => form.setLayout('visual')}
        mode={form.layoutMode}
        forceMobile={true}
        barOnlyForVisuals={true}
        visualPane={visualPane}
        contentBar={
          <ButtonBase className="bar-ready-button" onClick={() => form.setLayout('content')}>
            <ChevronUpIcon className="done-icon" />
            <div className="done-msg">{t('BACK')}</div>
          </ButtonBase>
        }
        barStickyOnContentTopScrolled={false}
        contentPane={<MainDateoForm />}
      />
    );
  }
}
