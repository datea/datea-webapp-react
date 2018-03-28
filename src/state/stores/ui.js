import {observable, action, computed} from 'mobx';
import {rem2px, getBreakpoint} from '../../utils';
import config from '../../config';

export default class UiStore {

  @observable activeBreakpoint = getBreakpoint();
  @observable windowSize = {width: window.innerWidth, height: window.innerHeight};
  @observable layout = {
    showFooter    : false,
    docHeightMode : 'window', // or 'window' -> for same as the window.
    show404       : false
  };
  @observable loading = false;
  @observable path = document.location.pathname;

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
    window.addEventListener('resize', this.handleResize);
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
    this.windowSize = {width: window.innerWidth, height: window.innerHeight};
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

  /************* SLIDSHOW *****************/
  @action openSlideshow(images, index = 0) {
    this.modals.slideshow = {images, index};
  }

  @action setSlideIndex(idx) {
    this.modals.slideshow.index = idx;
  }

  @action closeSlideShow() {
    this.modals.slideshow = false;
  }

}
