import React from 'react';
import Footer from '../footer';
import Header from '../header';
import UI from '../../stores/ui';
import {observer} from 'mobx-react';
import cn from 'classnames';
import CircularProgress from 'material-ui/CircularProgress';

import './main-layout.scss';

@observer
export default class MainLayout extends React.Component {

  render () {
    const pWrapClasses = cn(
      'page-content-wrap',
      !UI.layout.showFooter && 'hide-footer',
      UI.layout.docHeightMode == 'auto' && 'autoheight',
      UI.isMobile && 'mobile-nav'
    );

    return (
      <div className="main-wrap">
        <div className={pWrapClasses}>
          <Header path={this.props.location.pathname} />
          {UI.loading &&
            <div className="loading-wrap">
              <div className="loading-bg"></div>
              <div className="progress">
                <CircularProgress color={'#999999'} />
              </div>
            </div>
          }
    		  <div className="page-content">
            {this.props.children}
          </div>
    		  <div className="footer-push"></div>
    	  </div>
        {!!UI.layout.showFooter && <Footer />}
      </div>
    )
  }
}
