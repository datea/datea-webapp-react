import './mapping.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {inject, observer} from 'mobx-react';
import {t, translatable} from '../../i18n';
import {ResizeMapEvent} from '../../state/stores/map';

@inject(stores => ({isMobile: stores.store.ui.isMobile}))
@observer
export default class MappingLayout extends Component {

  static propTypes = {
    visualPane : PropTypes.node,
    contentBar : PropTypes.node,
    showBarOnContentTopScrolled: PropTypes.bool,
    contentPane : PropTypes.node,
    contentTopPane : PropTypes.node,
    mode : PropTypes.oneOf(['visual','content', 'visualFullscreen']),
    barSticky: PropTypes.bool,
    barStickyOnContentTopScrolled: PropTypes.bool,
    isMobile : PropTypes.bool,
    onOpenVisualClick: PropTypes.func
  };

  static defaultProps = {
    mode: 'content',
    isMobile : true,
    contentBarSticky: false,
    barStickyOnContentTopScrolled: true
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidUpdate() {
    window.dispatchEvent(ResizeMapEvent);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.contentBar && this.contentAreaRef && this.contentAreaRef.classList.contains('bar-sticky')) {
      this.contentAreaRef.classList.remove('bar-sticky');
    }
  }

  onContentScroll = (data, bar) => {
    const {mode, barSticky, barStickyOnContentTopScrolled, isMobile, contentBar} = this.props;
    if (!!contentBar && mode == 'content' && this.contentBarRef) {
      let makeSticky = null;

      if (barSticky) {
        makeSticky = this.contentAreaRef.scrollTop > (isMobile ? this.visualAreaRef.offsetHeight : 0);
      } else if (barStickyOnContentTopScrolled && this.contentTopRef) {
        makeSticky = this.contentAreaRef.scrollTop > this.contentTopRef.offsetHeight - 48;
      }

      if (makeSticky !== null && this.contentAreaRef.classList.contains('bar-sticky') != makeSticky) {
        this.contentAreaRef.classList[makeSticky ? 'add' : 'remove']('bar-sticky');
      }
    }
  }

  scrollToTop = () => {
    this.contentAreaRef.scrollTop = 0;
  }

  render() {
    const {
      isMobile,
      mode,
      visualPane,
      contentBar,
      contentTopPane,
      contentPane,
      onOpenVisualClick,
      barSticky,
      barStickyOnContentTopScrolled,
      barMode
    } = this.props;

    return (
      <div className={cn(
        'mapping-layout',
        `mode-${mode}`,
        isMobile ? 'mobile' : 'non-mobile',
        !!contentBar && barSticky && !barStickyOnContentTopScrolled && 'pad-bar-top'
        )}>
        <div className="visual-area" ref={r => {this.visualAreaRef = r}}>
          {visualPane}
        </div>
        <div className={cn('content-area', !!contentBar ? 'with-bar' : 'without-bar')}
          onScroll={this.onContentScroll}
          ref={r => {this.contentAreaRef = r}}>

          {isMobile &&
            <div className="visual-overlay" onClick={onOpenVisualClick} />
          }
          {!!contentBar &&
            <div className={cn('content-bar', barStickyOnContentTopScrolled && 'bar-sticky-conditional')}
              ref={r => {this.contentBarRef = r}}>
              {React.cloneElement(contentBar, {doScrollTop: this.scrollToTop})}
            </div>
          }
          {!!contentTopPane &&
            <div className="content-top-container" ref={r => {this.contentTopRef = r}}>
              {contentTopPane}
            </div>
          }
          <div className="content-container">{contentPane}</div>
        </div>
      </div>
    );
  }
}
