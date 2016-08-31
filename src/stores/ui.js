import {observable, action, computed} from 'mobx';
import {rem2px, getBreakpoint} from '../utils';

class UiStore {

  @observable activeBreakpoint = getBreakpoint();
  @observable windowSize = {width: window.innerWidth, height: window.innerHeight};
  @observable layout = {
    showFooter    : true,
    docHeightMode : 'auto' // or 'window' -> for same as the window.
  };
  @observable loading = false;
  @observable lastLoggedOutURL = '/';

  @computed get isMobile() {
    return this.activeBreakpoint == 'xs'
  }

  constructor() {
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

  @action setLastLoggedOutURL(url = null) {
    this.lastLoggedOutURL = url || window.location.pathname + window.location.search
  }
}

let singleton = new UiStore();
export default singleton;
