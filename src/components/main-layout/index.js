import React from 'react';
import Footer from '../footer';
import Header from '../header';
import UI from '../../stores/ui';
import {observer} from 'mobx-react';
import cn from 'classnames';

import './main-layout.scss';

console.log('UI',UI);

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
          <Header />
    		  <div className="page-content">{this.props.children}</div>
    		  <div className="footer-push"></div>
    	  </div>
        {!!UI.layout.showFooter && <Footer />}
      </div>
    )
  }
}
