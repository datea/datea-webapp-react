import React from 'react';
import DIcon from '../../icons';
import {Tr} from '../../i18n';
import RaisedButton from 'material-ui/RaisedButton';
import MappingColumnLayout from '../mapping-column-layout';
import {withRouter} from 'react-router';

import './landing.scss';
import dateritos from './dateritos.svg';

@withRouter
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
          <RaisedButton primary={false}
            style={{height: 50}}
            labelStyle={{fontSize: '1.1rem', paddingLeft: '20px', paddingRight: '20px'}}
            onTouchTap={() => this.props.history.push('/signup')}
            label={<Tr id="REGISTER" />}
            />
        </div>
      </div>
    )
  }
}
