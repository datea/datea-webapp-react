import './main-layout.scss';
import React from 'react';
import {observer, inject} from 'mobx-react';
import cn from 'classnames';
import {CircularProgress} from 'material-ui/Progress';
import Footer from '../footer';
import Header from '../header';

@inject('store')
@observer
export default class MainLayout extends React.Component {

  render () {
    const {ui} = this.props.store;
    const pWrapClasses = cn(
      'page-content-wrap',
      !ui.layout.showFooter && 'hide-footer',
      ui.layout.docHeightMode == 'auto' && 'autoheight',
      ui.isMobile && 'mobile-nav'
    );

    return (
      <div className="main-wrap">
        <div className={pWrapClasses}>
          <Header />
          {ui.loading &&
            <div className="loading-wrap">
              <div className="loading-bg"></div>
              <div className="progress">
                <CircularProgress style={{color: '#999999'}} size={60} />
              </div>
            </div>
          }
    		  <div className="page-content">
            {this.props.children}
          </div>
    		  <div className="footer-push"></div>
    	  </div>
        {!!ui.layout.showFooter && <Footer />}
      </div>
    )
  }
}
