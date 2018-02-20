import {observable, action, computed} from 'mobx';
import {rem2px, getBreakpoint} from '../../utils';
import config from '../../config';

export default class UiStore {

  @observable activeBreakpoint = getBreakpoint();
  @observable windowSize = {width: window.innerWidth, height: window.innerHeight};
  @observable layout = {
    showFooter    : true,
    docHeightMode : 'auto' // or 'window' -> for same as the window.
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
    return this.path == '/'+config.landingPath;
  }
  @computed get isHome() {
    return this.path == '/';
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
