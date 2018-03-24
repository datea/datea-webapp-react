import './mapping.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {ResizeMapEvent} from '../../state/stores/map';

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
    onOpenVisualClick: PropTypes.func,
    className: PropTypes.string,
    actions: PropTypes.object
  };

  static defaultProps = {
    mode: 'content',
    isMobile : true,
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
    const {mode, barSticky, barStickyOnContentTopScrolled, isMobile, contentBar} = this.props;

    if (!!contentBar && mode == 'content' && this.contentBarRef) {
      let makeSticky = null;

      if (barSticky) {
        makeSticky = this.contentAreaRef.scrollTop > (isMobile ? this.visualAreaRef.offsetHeight : 0);
      } else if (barStickyOnContentTopScrolled && this.contentTopRef) {
        if (!isMobile) {
          makeSticky = this.contentAreaRef.scrollTop > this.contentTopRef.offsetHeight - 48;
        } else {
          makeSticky = this.contentAreaRef.scrollTop > (this.visualAreaRef.offsetHeight + this.contentTopRef.offsetHeight);
        }
      }

      if (makeSticky !== null && this.contentAreaRef.classList.contains('bar-sticky') != makeSticky) {
        this.contentAreaRef.classList[makeSticky ? 'add' : 'remove']('bar-sticky');
      }
    }
  }

  scrollToTop = () => {
    this.contentAreaRef.scrollTop = 0;
    this.contentAreaRef.classList.remove('bar-sticky');
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
      barOnlyForVisuals,
      barSticky,
      barStickyOnContentTopScrolled,
      barMode,
      bottomBar,
      className,
      actions
    } = this.props;

    const {inTransition} = this.state;

    return (
      <div className={cn(
        'mapping-layout',
        `mode-${mode}`,
        isMobile ? 'mobile' : 'non-mobile',
        !!contentBar && barSticky && !barStickyOnContentTopScrolled && 'pad-bar-top',
        !!contentBar && !barSticky && barOnlyForVisuals && 'bar-only-for-visuals',
        inTransition && `in-transition in-transition-to-${mode}`,
        !!bottomBar && !isMobile && 'with-bottom-bar',
        className
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
            <div className={cn('content-bar', !barSticky && barStickyOnContentTopScrolled && 'bar-sticky-conditional')}
              ref={r => {this.contentBarRef = r}}>
              {barStickyOnContentTopScrolled
               ? React.cloneElement(contentBar, {doScrollTop: this.scrollToTop})
               : contentBar
              }
            </div>
          }
          {!!contentTopPane &&
            <div className="content-top-container" ref={r => {this.contentTopRef = r}}>
              {contentTopPane}
            </div>
          }
          <div className="content-container">{contentPane}</div>
        </div>
        {!isMobile && bottomBar &&
          <div className="bottom-bar">
            {bottomBar}
          </div>
        }
      </div>
    );
  }
}
