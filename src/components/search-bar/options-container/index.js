import './options-container.scss';
import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import cn from 'classnames';
import scroll from 'scroll';
import Tabs, { Tab } from 'material-ui/Tabs';
import AutocompleteList from '../autocomplete-list';
import {Tr} from '../../../i18n';

@inject('store')
@observer
export default class OptionsContainer extends Component {

  componentDidMount() {
    this.props.store.ui.isMobile && this.adjustMaxHeight();
  }

  componentDidUpdate() {
    if (this.props.store.ui.isMobile) {
      this.adjustMaxHeight();
    }else{
      if (this.props.selectIdx > -1) {
        const itemEl = document.querySelector('.search-ac-item-'+this.props.selectIdx);
        const container = this.wrapperRef;
        if (
            (itemEl.offsetTop + itemEl.offsetHeight) > (container.offsetHeight + container.scrollTop)
          || (container.scrollTop > 0 && itemEl.offsetTop < container.scrollTop)
        ) {
          scroll.top(container, itemEl.offsetTop, {duration: 150});
        }
      }
    }
  }

  adjustMaxHeight() {
    const maxHeight = window.innerHeight - 48;
    this.wrapperRef.style.maxHeight = (window.innerHeight - 48)+'px';
  }

  handleModeChange = (ev, val) => {
    this.props.setNonCloseClick();
    ev.stopPropagation();
    ev.preventDefault();
    this.props.store.searchBar.switchMode(val)
  }

  render() {
    const {children} = this.props;
    const {ui, searchBar} = this.props.store;

    return (
      <div ref={r => {this.wrapperRef = r}}
        className={cn('searchbar-options-content', ui.isMobile ? 'mobile' : 'normal', !searchBar.hasAcResults && 'empty')}
        >
        {searchBar.modeIsSwitcheable
         ? <div className="switecheable-options-wrap">
              <Tabs value={searchBar.mode}
                  onChange={this.handleModeChange}
                  fullWidth
                  centered
                  classes={{indicator: 'searchbar-tab-indicator'}}
                  className="searchbar-tabs">
                <Tab label={<Tr id="SEARCHBOX.LOCAL_SEARCH" />}
                     classes={{label : 'tab-label'}}
                     value="mapeo"
                     className="searchbar-tab" />
                <Tab label={<Tr id="SEARCHBOX.GLOBAL_SEARCH" />}
                     classes={{label : 'tab-label'}}
                     value="global"
                     className="searchbar-tab" />
              </Tabs>
              <AutocompleteList />
           </div>
         : <AutocompleteList />
        }
      </div>
    )
  }
}
