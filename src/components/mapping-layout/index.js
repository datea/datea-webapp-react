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
    barOnlyForVisuals : PropTypes.bool,
    isMobile : PropTypes.bool,
    forceMobile : PropTypes.bool,
    onOpenVisualClick: PropTypes.func,
    className: PropTypes.string
  };

  static defaultProps = {
    mode: 'content',
    isMobile : true,
    forceMobile : false,
    contentBarSticky: false,
    barOnlyForVisuals : false,
    barStickyOnContentTopScrolled: true
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      transitioning : false
    };
  }

  componentDidUpdate() {
    window.dispatchEvent(ResizeMapEvent);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.contentBar && this.contentAreaRef && this.contentAreaRef.classList.contains('bar-sticky')) {
      this.contentAreaRef.classList.remove('bar-sticky');
    }
    if (newProps.mode != this.props.mode) {
      this.setState({'inTransition' : true});
      setTimeout(() => this.setState({'inTransition': false}), 310);
    }
  }

  onContentScroll = (data, bar) => {
    const {mode, barSticky, barStickyOnContentTopScrolled, isMobile, forceMobile, contentBar} = this.props;
    const mobile = forceMobile || isMobile;
    if (!!contentBar && mode == 'content' && this.contentBarRef) {
      let makeSticky = null;

      if (barSticky) {
        makeSticky = this.contentAreaRef.scrollTop > (mobile ? this.visualAreaRef.offsetHeight : 0);
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
      forceMobile,
      mode,
      visualPane,
      contentBar,
      contentTopPane,
      contentPane,
      onOpenVisualClick,
      barOnlyForVisuals,
      barSticky,
      barStickyOnContentTopScrolled,
      barMode,
      className
    } = this.props;

    const {inTransition} = this.state;

    const mobile = forceMobile || isMobile;

    return (
      <div className={cn(
        'mapping-layout',
        `mode-${mode}`,
        mobile ? 'mobile' : 'non-mobile',
        !!contentBar && barSticky && !barStickyOnContentTopScrolled && 'pad-bar-top',
        !!contentBar && !barSticky && barOnlyForVisuals && 'bar-only-for-visuals',
        inTransition && `in-transition in-transition-to-${mode}`,
        className
        )}>
        <div className="visual-area" ref={r => {this.visualAreaRef = r}}>
          {visualPane}
        </div>
        <div className={cn('content-area', !!contentBar ? 'with-bar' : 'without-bar')}
          onScroll={this.onContentScroll}
          ref={r => {this.contentAreaRef = r}}>

          {mobile &&
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
