import {observable, action, computed, reaction, toJS} from 'mobx';
import {rem2px, getBreakpoint} from '../../utils';
import config from '../../config';

export default class UiStore {

  @observable activeBreakpoint = getBreakpoint();
  @observable windowSize = this.getWindowSize();
  @observable layout = {
    showFooter    : false,
    docHeightMode : 'window', // or 'window' -> for same as the window.
    show404       : false
  };
  @observable loading = false;
  @observable path = document.location.pathname;
  @observable isScrollTop = true;
  @observable forceNavShadow = false;

  @observable modals = {
    slideshow : false,
    dateo     : false
  };

  @computed get isMobile() {
    return this.activeBreakpoint == 'xs'
  }
  @computed get isLanding() {
    return !!this.main && !!this.main.router && this.main.router.currentView.name == 'welcome';
  }
  @computed get isHome() {
    return !!this.main && !!this.main.router && this.main.router.currentView.name == 'home';
  }

  constructor(main) {
    this.main = main;
    if (ENV_TYPE == 'browser') {
      window.addEventListener('resize', this.handleResize);
    }
    this.initSlideshowReaction();
    this.initScrollTracking();
  }

  getWindowSize() {
    if (ENV_TYPE == 'browser') {
      return {width: window.innerWidth, height: window.innerHeight};
    } else {
      return {width: 1024, height: 768};
    }
  }

  getCurrentPath() {
    if (ENV_TYPE == 'browser') return document.location.pathname;
  }

  handleResize = () => {
    this.resizing && clearTimeout(this.resizing);
		this.resizing = setTimeout(() => this.setWindowSize(), 400);
  }

  /************
    ACTIONS
  *************/
  @action setWindowSize() {
    this.activeBreakpoint = getBreakpoint();
    this.windowSize = this.getWindowSize();
  }

  @action showFooter(bool) {
    this.layout.showFooter = bool;
  }

  @action setLoading(bool) {
    this.loading = bool;
  }

  @action show404() {
    this.layout.show404 = true;
  }

  @action reset404() {
    this.layout.show404 = false;
  }

  @action setLayout = (layout) => {
    layout = layout || 'normal';
    if (layout == 'mapping') {
      this.layout.showFooter = false;
      this.layout.docHeightMode = 'window';
    } else if (layout == 'normal') {
      this.layout.showFooter = true;
      this.layout.docHeightMode = 'auto';
    }
  }

  /************ SCROLL BAR ****************/
  initScrollTracking() {
    if (ENV_TYPE == 'browser') {
      window.addEventListener('scroll', () =>  {
        const val = (window.scrollY || window.pageYOffset) == 0;
        if (val != this.isScrollTop) {
          this.isScrollTop = val;
        }
      });
    }
  }

  /************* SLIDSHOW *****************/

  initSlideshowReaction() {
    this.slideReaction = reaction(
      () => this.main.router && this.main.router.queryParams && !!this.main.router.queryParams.slideshow,
      (open) => !open && this.modals.slideShow && this.closeSlideShow()
    )
  }

  @action openSlideshow = (images, index = 0) => {
    const {router} = this.main;
    if (router.queryParams.slideshow) {
      let qParams = toJS(router.queryParams);
      qParams.slideshow = 'open';
      router.goTo(router.currentView, router.params, this.main, qParams);
    }
    this.modals.slideshow = {images, index};
  }

  @action setSlideIndex = (idx) => {
    this.modals.slideshow.index = idx;
  }

  @action closeSlideShow = () => {
    const {router} = this.main;
    if (router.queryParams.slideshow) {
      let qParams = toJS(router.queryParams);
      delete qParams.slideshow;
      router.goTo(router.currentView, router.params, this.main, qParams);
    }
    this.modals.slideshow = false;
  }

}
