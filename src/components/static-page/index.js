import './static-page.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PrivacyContent from './privacy';
import TOSContent from './tos';
import AboutContent from './about';

@inject('store')
@observer
export default class StaticPage extends Component {

  onTabChange = (event, value) => {
    this.props.store.router.goTo('info', {pageId: value});
  }

  componentDidMount() {
    const {store} = this.props;
    const page = store.router.routerState.params.pageId.toUpperCase();
    const metaData = {
      title : {id : 'METADATA.INFO.'+page+'.TITLE'}
    };
    store.metaData.set(metaData);
  }

  componentDidUpdate() {

  }

  render() {
    const tab = this.props.store.router.routerState.params.pageId || 'about';
    return (
      <div className="static-page-wrap">
        <Paper className="static-page-paper">
          <Tabs value={tab} onChange={this.onTabChange} className="static-tabs">
            <Tab label="Acerca" value="about" />
            <Tab label="Términos de uso" value="tos" />
            <Tab label="Privacidad" value="privacy" />
          </Tabs>
          {tab == 'about' && <AboutContent />}
          {tab == 'tos' && <TOSContent />}
          {tab == 'privacy' && <PrivacyContent />}
        </Paper>
      </div>
    );
  }
}
