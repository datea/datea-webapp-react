import React from 'react';
import './footer.scss';
import {t, translatable} from '../../i18n';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import DIcon from '../../icons';

@inject('store')
@translatable
@observer
export default class Footer extends React.Component {

  render () {
    const ui = this.props.store.ui;
    return (
      <div className="footer-holder container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-8">
            <div className="box">
          		<ul className="footer-menu">
          			<li><a href="http://ayuda.datea.pe/contacto">{t('MENU_FOOTER.CONTACT')}</a></li>
          			<li><a href="/acerca/terminos">{t('MENU_FOOTER.TERMS'+(ui.isMobile ? '_MOBILE' : ''))}</a></li>
          			<li><a href="/acerca/privacidad">{t('MENU_FOOTER.PRIVACY'+(ui.isMobile ? '_MOBILE' : ''))}</a></li>
          		</ul>
            </div>
          </div>
      		<div className="datea-rights hide-xs col-sm-4">
      			<div className="box">
      				<DIcon name="datea-logo" className="footer-logo" /> datea &copy; {moment().year()}
      			</div>
      		</div>
        </div>
    	</div>
    );
  }
}
