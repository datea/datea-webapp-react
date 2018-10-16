import React from 'react';
import DIcon from '../../icons';
import {Tr} from '../../i18n';
import Button from '@material-ui/core/Button';
import MappingColumnLayout from '../mapping-card-grid';
import {observer, inject} from 'mobx-react';

import './landing.scss';
import dateritos from './dateritos.svg';

@inject('store')
@observer
export default class LandingPage extends React.Component {

  render() {
    return (
      <div className="landing-page-container">
        <div className="logo-area">
          <DIcon name="datea-logo" />
          <h1 className="title">datea</h1>
          <h4 className="subtitle"><Tr id="LANDING_PAGE.SUBTITLE" /></h4>
        </div>
        <div className="slogan-area">
          <img className="dateritos" src={dateritos} alt="dateritos" />
          <div className="slogan"><Tr id="LANDING_PAGE.SLOGAN" /></div>
        </div>
        <div className="btns-area">
          <div className="msg"><Tr id="LOGIN_PAGE.NOT_A_DATERO" /></div>
          <Button variant="raised"
            size="large"
            onClick={() => this.props.store.router.goTo('register')}
            ><Tr id="REGISTER" /></Button>
          {/*labelStyle={{fontSize: '1.1rem', paddingLeft: '20px', paddingRight: '20px'}}*/}
        </div>
      </div>
    )
  }
}
